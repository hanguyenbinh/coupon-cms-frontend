import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { giftActions, alertActions } from "../_actions";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";

function GiftPage() {
  const { t, i18n } = useTranslation("gift-page", { useSuspense: false });
  const [page, setPage] = useState(1);

  const [selectedGift, setSelectedGift] = useState();
  const [show, setShow] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);

  const [langObject, setLangObject] = useState([]);
  const [modalTitle, setModelTitle] = useState();

  const [couponCodes, setCouponCodes] = useState([]);

  const gifts = useSelector(state => state.gifts);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(giftActions.getAll());
  }, []);

  const handlePageChanged = num => {
    setPage(num);
    dispatch(giftActions.getAll(num));
  };
  const handleSelectGift = gift => {
    setSelectedGift(gift);
    setModelTitle("Edit gift: " + gift.defaultName);
    setLangObject(gift.languages);
    setShow(true);
  };
  const handleCreateNewGift = () => {
    setSelectedGift({
      couponExchangeRate: 1
    });
    setModelTitle("Create gift:");
    setLangObject([]);
    setShow(true);
  };
  const checkValidGift = () => {
    if (langObject.length === 0)
      if (selectedGift.couponExchangeRate < 1) {
        return false;
      }
    let isOk = true;
    let isHaveEn = false;
    langObject.forEach(lang => {
      if (!lang.lang || lang.lang.length !== 2 || !lang.value) {
        isOk = false;
        return;
      }
      if (lang.lang === "en") {
        isHaveEn = true;
      }
    });
    return isOk && isHaveEn;
  };

  const handleUpdateGift = () => {
    if (!checkValidGift()) {
      dispatch(alertActions.error("language definition is not correct"));
      return;
    }
    const gift = selectedGift;
    gift.languages = langObject;
    if (modalTitle === "Create gift:") {
      dispatch(giftActions.createGift(gift));
    } else {
      dispatch(giftActions.updateGift(gift.id, gift));
    }
    setShow(false);
  };
  const handleDeleteGift = giftId => {
    dispatch(giftActions.deleteGift(giftId));
  };
  const handleChangeLanguage = (e, index) => {
    const { name, value } = e.target;
    const list = [...langObject];
    list[index][name] = value;
    setLangObject(list);
  };

  const handleChangeCouponCode = (e, index) => {
    const { value } = e.target;
    const list = [...couponCodes];
    list[index] = value;    
    setCouponCodes(list);
  };
  const handleClose = () => {
    if (modalTitle === "Create gift:") {
      setShow(false);
    } else {
      if (!checkValidGift()) {
        dispatch(alertActions.error("language definition is not correct"));
        return;
      }
      setShow(false);
    }
  };

  const handleOpenRedeem = gift => {
    const codes = [];
    for (let i = 0; i < gift.couponExchangeRate; i++) {
      codes.push("");
    }
    setCouponCodes(codes);
    setSelectedGift(gift);
    setShowRedeem(true);
  };

  const handleCloseRedeem = () => {
    setShowRedeem(false);
  };

  const handleRemoveClick = index => {
    const list = [...langObject];
    list.splice(index, 1);
    setLangObject(list);
  };
  const handleAddClick = index => {
    if (langObject.length === 0) {
      setLangObject([...langObject, { id: uuidv4(), lang: "", value: "" }]);
    } else {
      const newLangObj = [];
      for (let i = 0; i < langObject.length; i++) {
        newLangObj.push(langObject[i]);
        if (i === index) {
          newLangObj.push({ id: uuidv4(), lang: "", value: "" });
        }
      }
      setLangObject(newLangObj);
    }
  };
  const handleRedeem = () => {
    let isOK = true;
    couponCodes.forEach(code => {
      if (!code || code.length !== 10) {
        isOK = false;
        return;
      }
    });
    if (!isOK) {
      dispatch(
        alertActions.error("Coupon code must not be empty and length = 10")
      );
      return;
    }
    console.log('handleChangeCouponCode', couponCodes);
    const giftId = selectedGift.id;
    const coupons = couponCodes;
    dispatch(giftActions.redeem(giftId, coupons));
    setShowRedeem(false);
  };
  return (
    <div className="col-xs-6">
      <h1>Gift manager</h1>
      <Button onClick={() => handleCreateNewGift()}>Create</Button>
      <h3>Total gifts: {gifts.total ? gifts.total : 0}</h3>
      <h5>current page: {page}</h5>
      <button
        className="btn btn-secondary"
        disabled={page <= 1}
        onClick={() => handlePageChanged(page - 1)}
      >
        previous
      </button>
      <button
        className="btn btn-secondary"
        disabled={!gifts.items || gifts.items.length < 20}
        onClick={() => handlePageChanged(page + 1)}
      >
        next
      </button>
      {gifts.loading && <em>Loading gifts...</em>}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Rate</th>
            <th scope="col">Stock</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {gifts.items &&
            gifts.items.map((gift, index) => (
              <tr key={gift.id}>
                <td onClick={() => handleSelectGift(gift)}>{(page-1)*20 + index + 1}</td>
                <td onClick={() => handleSelectGift(gift)}>
                  {gift.name ? gift.name : gift.defaultName}
                </td>
                <td onClick={() => handleSelectGift(gift)}>
                  {gift.couponExchangeRate}
                </td>
                <td onClick={() => handleSelectGift(gift)}>{gift.inStock}</td>
                <td>
                  <Button onClick={() => handleOpenRedeem(gift)}>Redeem</Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteGift(gift.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {gifts.error && <span className="text-danger">ERROR: {gifts.error}</span>}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={true}
        size="lg"
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedGift && (
            <Form.Group as={Row}>
              <Col sm="4">
                <Form.Control
                  readOnly
                  name="defaultName"
                  placeholder="defaultName"
                  defaultValue={selectedGift.defaultName}
                ></Form.Control>
              </Col>
              <Col sm="2">
                <Form.Control
                  name="couponExchangeRate"
                  placeholder="couponExchangeRate"
                  defaultValue={selectedGift.couponExchangeRate}
                  onChange={e => {
                    gift = selectedGift;
                    gift.couponExchangeRate = e.value;
                    setSelectedGift(gift);
                  }}
                ></Form.Control>
              </Col>
              <Col sm="2">
                <Form.Control
                  name="inStock"
                  placeholder="inStock"
                  defaultValue={selectedGift.inStock}
                  onChange={e => {
                    gift = selectedGift;
                    gift.inStock = e.value;
                    setSelectedGift(gift);
                  }}
                ></Form.Control>
              </Col>
            </Form.Group>
          )}
          {(!langObject || langObject.length === 0) && (
            <Button onClick={() => handleAddClick(0)}>Add</Button>
          )}
          {langObject &&
            langObject.map((language, index) => (
              <Form.Group as={Row} key={language.id}>
                <Col sm="2">
                  <Form.Control
                    name="lang"
                    placeholder="lang"
                    defaultValue={language.lang}
                    onChange={e => {
                      handleChangeLanguage(e, index);
                    }}
                  ></Form.Control>
                </Col>
                <Col sm="4">
                  <Form.Control
                    name="value"
                    placeholder="value"
                    defaultValue={language.value}
                    onChange={e => {
                      handleChangeLanguage(e, index);
                    }}
                  ></Form.Control>
                </Col>
                <Col sm="2">
                  <Button onClick={() => handleRemoveClick(index)}>-</Button>
                  <Button onClick={() => handleAddClick(index)}>+</Button>
                </Col>
              </Form.Group>
            ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateGift}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showRedeem}
        onHide={handleCloseRedeem}
        backdrop="static"
        keyboard={true}
        size="lg"
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>Redeem</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedGift && (
            <Form.Group as={Row}>
              <Col sm="4">
                <Form.Control
                  readOnly
                  name="defaultName"
                  placeholder="defaultName"
                  defaultValue={selectedGift.defaultName}
                ></Form.Control>
              </Col>
              <Col sm="2">
                <Form.Control
                  readOnly
                  name="couponExchangeRate"
                  placeholder="couponExchangeRate"
                  defaultValue={selectedGift.couponExchangeRate}
                ></Form.Control>
              </Col>
              <Col sm="2">
                <Form.Control
                  readOnly
                  name="inStock"
                  placeholder="inStock"
                  defaultValue={selectedGift.inStock}
                ></Form.Control>
              </Col>
            </Form.Group>
          )}

          {couponCodes &&
            couponCodes.map((couponCode, index) => (
              <Form.Group as={Row} key={uuidv4()}>
                <Col sm="4">
                  <Form.Control
                    name="couponCode"
                    placeholder="couponCode"
                    defaultValue={couponCode}
                    onChange={e => {
                      handleChangeCouponCode(e, index);
                    }}
                  ></Form.Control>
                </Col>
              </Form.Group>
            ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRedeem}>
            Close
          </Button>
          <Button variant="primary" onClick={handleRedeem}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export { GiftPage };
