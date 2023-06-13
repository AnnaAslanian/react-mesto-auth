import React, { useState, useEffect } from "react"
import { api } from "../utils/Api"
import Header from "./Header"
import Footer from "./Footer"
import Main from "./Main"
import ImagePopup from "./ImagePopup"
import { CurrentUserContext } from "../contexts/CurrentUserContext"
import PopupWithForm from "./PopupWithForm"
import EditProfilePopup from "./EditProfilePopup"
import EditAvatarPopup from "./EditAvatarPopup"
import AddPlacePopup from "./AddPlacePopup"
import DeleteConfirmPopup from "./DeleteConfirmPopup"
import Login from "../components/Login"
import Register from "../components/Register"
import ProtectedRoute from "../components/ProtectedRoute"
import * as Auth from "../utils/Auth"
import InfoTooltip from "../components/InfoTooltip"


function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [renderLoading, setRenderLoading] = useState(false);
  const [isDeleteCardPopup, setDeleteCardPopup] = useState(false);
  const [isInfotooltipPopupOpen, setInfotooltipPopupOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate()

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  };
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  };
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  };
  function handleCardClick(item) {
    setSelectedCard(item)
  };
  function handleDeleteCardClick(item) {
    setSelectedCard(item)
    setDeleteCardPopup(true)
  };


  useEffect(() => {
    api
      .getInitialCards()
      .then((cards) => setCards(cards))
      .catch((err) => console.log(`Ошибка ${err}`))
  }, []);

  function closeAllPopups() {
    const allPopupStates = [
      setIsEditProfilePopupOpen,
      setIsAddPlacePopupOpen,
      setIsEditAvatarPopupOpen,
      setDeleteCardPopup,
      setInfotooltipPopupOpen
    ]
    allPopupStates.forEach((state) => state(false))
    setSelectedCard(null)
  };

  function addCard(data) {
    setRenderLoading(true)
    api
      .getAddCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards])
        closeAllPopups()
      })
      .catch((err) => console.log(`Ошибка ${err}`))
      .finally(() => {
        setRenderLoading(false)
      })
  };

  function handleUpdateAvatar(link) {
    api
      .getEditAvatar(link)
      .then((item) => {
        setCurrentUser(item)
        closeAllPopups()
      })
      .catch((err) => console.log(`Ошибка ${err}`))
      .finally(() => {
        setRenderLoading(false)
      })
  };

  function handleUpdateUser(data) {
    api
      .getEditUser(data)
      .then((userInfo) => {
        setCurrentUser(userInfo)
        closeAllPopups()
      })
      .catch((err) => console.log(`Ошибка ${err}`))
      .finally(() => {
        setRenderLoading(false)
      })
  };

  useEffect(() => {
    if (loggedIn) {
    api
      .getInitialUser()
      .then((userInfo) => setCurrentUser(userInfo))
      .catch((err) => console.log(`Ошибка ${err}`))
  }}, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id)
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)))
      })
      .catch((err) => console.log(`Ошибка ${err}`))
  };

  function handleCardDelete(id) {
    api
      .deleteCards(id)
      .then(() => {
        setCards((state) => state.filter((card) => card._id !== id))
      })
      .catch((err) => console.log(`Ошибка ${err}`))
      .finally(() => {
        setRenderLoading(false)
      })
  };

  function handleLoginTrueStatus() {
    setLoggedIn(true);
  }


  const handleRegister = (email, password) => {
    setRenderLoading(true)
    Auth
    .register(email, password)
    .then(() => {
      setSuccess(true);
      navigate('/sign-in');
    })
    .catch((err) => {
      setSuccess(false);
      setInfotooltipPopupOpen(true);
     console.log(err);
    })
    .finally(() => {
      setRenderLoading(false)
    })
  }

  const handleLogin = (email, password) => {
    setRenderLoading(true)
    Auth
    .authorization(email, password)
    .then((data) => {
      if (data.token) localStorage.setItem("token", data.token);
      handleLoginTrueStatus();
      setUserEmail(email);
      navigate('/');
      
    })
    .catch((err) => {
      setSuccess(false);
      setInfotooltipPopupOpen(true);
      console.log(err);
    })
    .finally(() => {
      setRenderLoading(false);
    })
  }


  const tokenCheck = () => {
    const token = localStorage.getItem("token");
    if (token) {
      Auth 
       .tokenCheck(token)
       .then((res) => {
          handleLoginTrueStatus();
          setUserEmail(res.data.email);
          navigate("/");
       })
       .catch((err) => {
        console.log(err);
        navigate('/sign-in')
       })
    }
  }


  useEffect(() => {
    tokenCheck();
  }, []);


  function onSignOut() {
    localStorage.removeItem("token");
    navigate('/sign-in')
  }


  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <div className="root">
          <Header />
          <Main
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}
          />
          <Footer />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={addCard}
          />
          <PopupWithForm
            title={"Вы уверены"}
            name={"delete"}
            onClose={closeAllPopups}
            buttonText={"Вы уверены?"}
          ></PopupWithForm>
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        </div>
      </div>
    </CurrentUserContext.Provider>
  )
}

export default App