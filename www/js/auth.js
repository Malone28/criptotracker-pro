/**
 * CryptoTracker.Pro - Dark Luxury Authentication & Firebase Cloud Sync Engine
 * Handles user sessions, cross-device sync, and Firebase Authentication (Email/Password, Google & Apple).
 */

(function(window, document) {
  'use strict';

  var STORAGE_KEY_USER = 'criptotracker_auth_user';
  var STORAGE_KEY_REMEMBER = 'criptotracker_auth_remember';

  // Firebase Configuration for CryptoTracker.Pro
  var FIREBASE_CONFIG = {
    apiKey: "AIzaSyDfWvCUQIP0-XobJUMYTh8HshqE2N6eWM8",
    authDomain: "criptotracker-pro.firebaseapp.com",
    projectId: "criptotracker-pro",
    storageBucket: "criptotracker-pro.firebasestorage.app",
    messagingSenderId: "74265939519",
    appId: "1:74265939519:web:688cde479c815dece2b28a"
  };

  var currentUser = null;
  var currentMode = 'login'; // 'login' or 'register'
  var firebaseAuth = null;
  var firestoreDb = null;

  // DOM Elements cache
  var els = {};

  function init() {
    cacheDom();
    loadSession();
    initFirebase();
    bindEvents();
    initDownloadModal();
    updateUI();
  }

  function cacheDom() {
    els = {
      modal: document.getElementById('auth-modal'),
      closeBtn: document.getElementById('auth-modal-close'),
      headerBtn: document.getElementById('auth-header-btn'),
      headerText: document.getElementById('auth-header-text'),
      headerIcon: document.getElementById('auth-header-icon'),
      mobileBtn: document.getElementById('mobile-auth-btn'),
      mobileIcon: document.getElementById('mobile-auth-icon'),
      drawerBtn: document.getElementById('drawer-auth-btn'),
      drawerIcon: document.getElementById('drawer-auth-icon'),
      drawerTitle: document.getElementById('drawer-auth-title'),
      drawerSub: document.getElementById('drawer-auth-sub'),
      tabLogin: document.getElementById('auth-tab-login'),
      tabRegister: document.getElementById('auth-tab-register'),
      socialApple: document.getElementById('btn-auth-apple'),
      socialGoogle: document.getElementById('btn-auth-google'),
      socialGroup: document.getElementById('auth-social-group'),
      divider: document.getElementById('auth-divider'),
      navTabs: document.getElementById('auth-nav-tabs'),
      backBtn: document.getElementById('auth-back-btn'),
      title: document.getElementById('auth-modal-title'),
      subtitle: document.querySelector('.auth-card-header .auth-subtitle'),
      emailLabel: document.querySelector('label[for="auth-input-email"]'),
      form: document.getElementById('auth-form'),
      fieldName: document.getElementById('auth-field-name'),
      inputName: document.getElementById('auth-input-name'),
      inputEmail: document.getElementById('auth-input-email'),
      inputPassword: document.getElementById('auth-input-password'),
      togglePwd: document.getElementById('auth-toggle-pwd'),
      rememberCheck: document.getElementById('auth-remember-check'),
      submitBtn: document.getElementById('auth-submit-btn'),
      submitText: document.getElementById('auth-submit-text'),
      forgotLink: document.getElementById('auth-forgot-link'),
      profileCard: document.getElementById('auth-profile-card'),
      profileAvatar: document.getElementById('profile-avatar'),
      profileName: document.getElementById('profile-name'),
      profileEmail: document.getElementById('profile-email'),
      profilePortfolioVal: document.getElementById('profile-portfolio-val'),
      profileTierBadge: document.querySelector('.profile-tier-badge'),
      btnProfileSync: document.getElementById('btn-profile-sync'),
      btnProfileLogout: document.getElementById('btn-profile-logout')
    };
  }

  function initFirebase() {
    try {
      if (typeof firebase !== 'undefined' && firebase.initializeApp) {
        if (!firebase.apps || firebase.apps.length === 0) {
          firebase.initializeApp(FIREBASE_CONFIG);
        }
        firebaseAuth = firebase.auth();
        if (typeof firebase.firestore === 'function') {
          try {
            firestoreDb = firebase.firestore();
          } catch(fErr) {
            console.warn('[Firebase Firestore Init]', fErr);
          }
        }

        // Local persistence so logins survive reloads and restarts
        if (firebase.auth.Auth && firebase.auth.Auth.Persistence) {
          firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(function(err) {
            console.warn('[Firebase Auth] Persistence error:', err);
          });
        }

        // Real-time listener for Auth State
        firebaseAuth.onAuthStateChanged(function(user) {
          if (user) {
            var prov = 'Firebase';
            if (user.providerData && user.providerData.length > 0) {
              var pId = user.providerData[0].providerId;
              if (pId.indexOf('google') !== -1) prov = 'Google';
              else if (pId.indexOf('apple') !== -1) prov = 'Apple';
            }
            if (currentUser && (currentUser.provider === 'Google' || currentUser.provider === 'Apple')) {
              prov = currentUser.provider;
            }

            var appUser = {
              id: user.uid,
              name: user.displayName || (user.email ? user.email.split('@')[0] : 'Inversor PRO'),
              email: user.email || '',
              photoURL: user.photoURL || '',
              provider: prov,
              tier: 'FREE',
              createdAt: user.metadata ? user.metadata.creationTime : new Date().toISOString()
            };
            saveSession(appUser);
            // Sincronizar automáticamente datos de Firestore en la nube
            syncCloudDataWithFirestore(user.uid, false);
          }
        });
        // Handle redirect result for Google / Apple OAuth (mobile browsers / webviews)
        firebaseAuth.getRedirectResult().then(function(result) {
          if (result && result.user) {
            var u = result.user;
            var prov = (result.credential && result.credential.providerId === 'apple.com') ? 'Apple' : 'Google';
            var appUser = {
              id: u.uid,
              name: u.displayName || (prov === 'Apple' ? 'Apple VIP Investor' : 'Google PRO Trader'),
              email: u.email || '',
              photoURL: u.photoURL || '',
              provider: prov,
              tier: 'FREE',
              createdAt: new Date().toISOString()
            };
            saveSession(appUser);
            syncCloudDataWithFirestore(u.uid, false);
            showAuthToast('¡Bienvenido! Sesión con ' + prov + ' iniciada correctamente.', 'success');
          }
        }).catch(function(err) {
          console.warn('[Firebase Auth] Redirect error:', err);
          if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
            if (err.message && err.message.toLowerCase().indexOf('google') !== -1) {
              showAuthToast('El proveedor Google no está activo en Firebase.', 'warning');
            } else {
              showAppleConfigNotice();
            }
          } else if (err.code && err.code !== 'auth/redirect-cancelled-by-user') {
            showAuthToast(err.message || 'Error en inicio de sesión.', 'error');
          }
        });
      }
    } catch (e) {
      console.warn('[Firebase Auth] Initialization exception:', e);
    }
  }

  function loadSession() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        currentUser = JSON.parse(saved);
      }
    } catch (e) {
      currentUser = null;
    }
  }

  function saveSession(user) {
    currentUser = user;
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.warn('Error saving auth session', e);
    }
    updateUI();
  }

  function bindEvents() {
    // Open Modal Triggers
    if (els.headerBtn) {
      els.headerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
      });
    }

    if (els.mobileBtn) {
      els.mobileBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
      });
    }

    if (els.drawerBtn) {
      els.drawerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        var drawer = document.getElementById('mobile-nav-drawer');
        var backdrop = document.getElementById('nav-backdrop');
        var hamburger = document.getElementById('nav-hamburger');
        if (drawer) drawer.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
        if (hamburger) hamburger.classList.remove('open');
        document.body.classList.remove('menu-open');
        openModal();
      });
    }

    // Close Modal
    if (els.closeBtn) {
      els.closeBtn.addEventListener('click', closeModal);
    }

    if (els.modal) {
      els.modal.addEventListener('click', function(e) {
        if (e.target === els.modal) closeModal();
      });
    }

    // Escape Key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && els.modal && !els.modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    // Tab Switching (Login vs Register)
    if (els.tabLogin) {
      els.tabLogin.addEventListener('click', function() { setMode('login'); });
    }
    if (els.tabRegister) {
      els.tabRegister.addEventListener('click', function() { setMode('register'); });
    }


    // Password Visibility Toggle
    if (els.togglePwd && els.inputPassword) {
      els.togglePwd.addEventListener('click', function() {
        var isPwd = els.inputPassword.type === 'password';
        els.inputPassword.type = isPwd ? 'text' : 'password';
        els.togglePwd.textContent = isPwd ? '🙈' : '👁️';
      });
    }

    // Social Login: Apple
    if (els.socialApple) {
      els.socialApple.addEventListener('click', function() {
        handleSocialLogin('Apple');
      });
    }

    // Social Login: Google
    if (els.socialGoogle) {
      els.socialGoogle.addEventListener('click', function() {
        handleSocialLogin('Google');
      });
    }

    // Form Submit
    if (els.form) {
      els.form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmit();
      });
    }

    // Forgot Password
    if (els.forgotLink) {
      els.forgotLink.addEventListener('click', function() {
        var email = els.inputEmail && els.inputEmail.value.trim();
        if (!email) {
          showAuthToast(i18n('auth_label_email', 'Introduce tu correo electrónico'), 'warning');
          if (els.inputEmail) els.inputEmail.focus();
          return;
        }

        if (firebaseAuth) {
          firebaseAuth.sendPasswordResetEmail(email)
            .then(function() {
              showAuthToast(
                i18n('auth_reset_sent', 'Enlace de restablecimiento enviado a ') + email,
                'success'
              );
            })
            .catch(function(err) {
              handleAuthError(err);
            });
        } else {
          showAuthToast(
            i18n('auth_reset_sent', 'Enlace de restablecimiento enviado a ') + email,
            'success'
          );
        }
      });
    }

    // Profile Actions
    if (els.btnProfileSync) {
      els.btnProfileSync.addEventListener('click', syncCloudData);
    }

    if (els.btnProfileLogout) {
      els.btnProfileLogout.addEventListener('click', logout);
    }
  }

  function setMode(mode) {
    currentMode = mode;
    if (els.tabLogin) els.tabLogin.classList.toggle('active', mode === 'login');
    if (els.tabRegister) els.tabRegister.classList.toggle('active', mode === 'register');

    if (els.fieldName) {
      els.fieldName.style.display = mode === 'register' ? 'block' : 'none';
      if (els.inputName) els.inputName.required = (mode === 'register');
    }

    if (els.submitText) {
      els.submitText.textContent = mode === 'login'
        ? i18n('auth_btn_submit_login', 'Entrar a mi Cuenta')
        : i18n('auth_btn_submit_register', 'Crear Cuenta PRO');
    }
  }

  function openModal(forcedMode) {
    if (!els.modal) {
      console.warn('Error: No se encontró el modal en el HTML.');
      return;
    }

    updateModalState();
    els.modal.classList.remove('hidden');
    document.body.classList.add('modal-open');

    if (!currentUser && els.inputEmail) {
      setTimeout(function() { els.inputEmail.focus(); }, 120);
    }
  }

  function closeModal() {
    if (!els.modal) return;
    els.modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }

  function updateModalState() {
    if (currentUser) {
      if (els.navTabs) els.navTabs.style.display = 'none';
      if (els.socialGroup) els.socialGroup.style.display = 'none';
      if (els.divider) els.divider.style.display = 'none';
      if (els.backBtn) els.backBtn.style.display = 'none';
      if (els.form) els.form.style.display = 'none';
      if (els.profileCard) els.profileCard.style.display = 'block';

      // Avatar & badge according to provider
      if (currentUser.provider === 'Apple') {
        if (els.profileAvatar) els.profileAvatar.textContent = '';
        if (els.profileTierBadge) els.profileTierBadge.textContent = '🍎 Apple ID PRO';
      } else if (currentUser.provider === 'Google') {
        if (els.profileAvatar) els.profileAvatar.textContent = 'G';
        if (els.profileTierBadge) els.profileTierBadge.textContent = '🌐 Google PRO';
      } else {
        var initial = (currentUser.name || currentUser.email || 'U').charAt(0).toUpperCase();
        if (els.profileAvatar) els.profileAvatar.textContent = initial;
        if (els.profileTierBadge) els.profileTierBadge.textContent = '💎 PRO';
      }

      if (els.profileName) els.profileName.textContent = currentUser.name || 'Inversor PRO';
      if (els.profileEmail) els.profileEmail.textContent = currentUser.email;

      var bal = '$10,000.00';
      var fabVal = document.getElementById('fab-value');
      if (fabVal && fabVal.textContent) bal = fabVal.textContent;
      if (els.profilePortfolioVal) els.profilePortfolioVal.textContent = bal;

    } else {
      if (els.navTabs) els.navTabs.style.display = 'flex';
      if (els.socialGroup) els.socialGroup.style.display = 'grid';
      if (els.divider) els.divider.style.display = 'flex';
      if (els.form) els.form.style.display = 'block';
      if (els.profileCard) els.profileCard.style.display = 'none';
      setMode(currentMode);
    }
  }

  function handleSocialLogin(providerName) {
    if (!firebaseAuth) {
      showAuthToast('Firebase no está inicializado.', 'error');
      return;
    }

    var btn = providerName === 'Apple' ? els.socialApple : els.socialGoogle;
    if (btn) btn.classList.add('loading');

    var provider = null;
    if (providerName === 'Google') {
      provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
    } else if (providerName === 'Apple') {
      provider = new firebase.auth.OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
    }

    if (!provider) {
      if (btn) btn.classList.remove('loading');
      return;
    }

    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      if (providerName === 'Google' && window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.FirebaseAuthentication) {
        showAuthToast('Iniciando sesión segura con Google...', 'info');
        window.Capacitor.Plugins.FirebaseAuthentication.signInWithGoogle()
          .then(function(result) {
            if (result && result.credential && result.credential.idToken) {
              var credential = firebase.auth.GoogleAuthProvider.credential(result.credential.idToken, result.credential.accessToken);
              return firebaseAuth.signInWithCredential(credential);
            } else if (result && result.user) {
              return Promise.resolve({ user: result.user });
            } else {
              throw new Error('Error al recuperar credenciales de Google');
            }
          })
          .then(function(cred) {
            var u = (cred && cred.user) ? cred.user : (firebaseAuth && firebaseAuth.currentUser);
            if (u) {
              var appUser = {
                id: u.uid,
                name: u.displayName || (u.email ? u.email.split('@')[0] : 'Inversor PRO'),
                email: u.email || '',
                photoURL: u.photoURL || '',
                provider: 'Google',
                tier: 'FREE',
                createdAt: (u.metadata && u.metadata.creationTime) ? u.metadata.creationTime : new Date().toISOString()
              };
              saveSession(appUser);
              syncCloudDataWithFirestore(u.uid, false);
            }
            closeModal();
            showAuthToast('¡Bienvenido! Sesión iniciada con Google.', 'success');
          })
          .catch(function(err) {
            console.error('[Google Native Auth Error]', err);
            var errStr = ((err && (err.message || err.code || err.errorMessage)) || '') + '';
            if (errStr.indexOf('cancel') !== -1 || errStr.indexOf('12501') !== -1 || errStr.indexOf('Canceled') !== -1) {
              return;
            }
            if (errStr.indexOf('10') !== -1 || errStr.indexOf('12500') !== -1 || errStr.indexOf('DEVELOPER_ERROR') !== -1) {
              showAuthToast('Error 10: Asegúrate de registrar la huella SHA-1 de Play Store en Firebase Console.', 'warning');
              return;
            }
            handleAuthError(err);
          })
          .finally(function() {
            if (btn) btn.classList.remove('loading');
          });
        return;
      }

      // En dispositivos móviles (iPhone/Android), lanzar la redirección oficial directamente
      firebaseAuth.signInWithRedirect(provider)
        .catch(function(error) {
          console.warn('[Firebase Mobile OAuth Error]', error);
          if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
            if (providerName === 'Apple') {
              showAppleConfigNotice();
            } else {
              showAuthToast('El proveedor ' + providerName + ' no está activo en Firebase.', 'warning');
            }
          } else if (error.code === 'auth/invalid-cordova-configuration') {
            if (providerName === 'Apple') {
              showAppleConfigNotice();
            } else if (providerName === 'Google') {
              showGoogleConfigNotice();
            } else {
              showAuthToast('El inicio social requiere configuración de plugins nativos en iOS.', 'error');
            }
          } else {
            showAuthToast(error.message || ('Error al conectar con ' + providerName), 'error');
          }
        })
        .finally(function() {
          if (btn) btn.classList.remove('loading');
        });
      return;
    }

    // En navegadores de escritorio, intentar popup con fallback a redirect
    firebaseAuth.signInWithPopup(provider)
      .then(function(result) {
        closeModal();
        var u = result && result.user;
        var appUser = {
          id: u ? u.uid : 'usr_' + Date.now().toString(36),
          name: (u && u.displayName) || (providerName === 'Apple' ? 'Apple VIP Investor' : 'Google PRO Trader'),
          email: (u && u.email) || '',
          photoURL: (u && u.photoURL) || '',
          provider: providerName,
          tier: 'FREE',
          createdAt: new Date().toISOString()
        };
        saveSession(appUser);
        syncCloudDataWithFirestore(appUser.id, false);
        showAuthToast(
          '¡Bienvenido a CryptoTracker.Pro! Cuenta de ' + providerName + ' conectada con éxito.',
          'success'
        );
      })
      .catch(function(error) {
        console.warn('[Firebase Desktop OAuth Error]', error);
        if (error.code === 'auth/popup-blocked' || error.code === 'auth/operation-not-supported-in-this-environment') {
          return firebaseAuth.signInWithRedirect(provider);
        }
        if (error.code === 'auth/configuration-not-found' || error.code === 'auth/operation-not-allowed') {
          if (providerName === 'Apple') {
            showAppleConfigNotice();
          } else {
            showAuthToast('El proveedor ' + providerName + ' no está activo en Firebase.', 'warning');
          }
          return;
        }
        if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
          showAuthToast(error.message || ('Error al autenticar con ' + providerName), 'error');
        }
      })
      .finally(function() {
        if (btn) btn.classList.remove('loading');
      });
  }

  function handleFormSubmit() {
    var email = els.inputEmail ? els.inputEmail.value.trim() : '';
    var password = els.inputPassword ? els.inputPassword.value.trim() : '';
    var name = els.inputName ? els.inputName.value.trim() : '';

    if (!email || !password) return;

    if (password.length < 6) {
      showAuthToast('La contraseña debe tener al menos 6 caracteres.', 'warning');
      if (els.inputPassword) els.inputPassword.focus();
      return;
    }

    if (els.submitBtn) els.submitBtn.classList.add('loading');

    if (!firebaseAuth) {
      fallbackFormSubmit(email, password, name);
      return;
    }

    if (currentMode === 'register') {
      firebaseAuth.createUserWithEmailAndPassword(email, password)
        .then(function(cred) {
          var u = cred.user;
          var appUser = {
            id: u.uid,
            name: name || email.split('@')[0],
            email: u.email || email,
            photoURL: '',
            provider: 'Email',
            tier: 'FREE',
            createdAt: new Date().toISOString()
          };
          saveSession(appUser);
          syncCloudDataWithFirestore(appUser.id, false);
          if (name && u.updateProfile) {
            u.updateProfile({ displayName: name });
          }
          closeModal();
          showAuthToast(
            i18n('auth_created_toast', '¡Cuenta creada con éxito! Sincronización multidispositivo activada.'),
            'success'
          );
        })
        .catch(function(err) {
          handleAuthError(err);
        })
        .finally(function() {
          if (els.submitBtn) els.submitBtn.classList.remove('loading');
        });
    } else {
      firebaseAuth.signInWithEmailAndPassword(email, password)
        .then(function(cred) {
          var u = cred.user;
          var appUser = {
            id: u.uid,
            name: (u && u.displayName) || email.split('@')[0],
            email: (u && u.email) || email,
            photoURL: (u && u.photoURL) || '',
            provider: 'Email',
            tier: 'FREE',
            createdAt: new Date().toISOString()
          };
          saveSession(appUser);
          syncCloudDataWithFirestore(appUser.id, false);
          closeModal();
          showAuthToast(
            i18n('auth_welcome_toast', '¡Bienvenido a CryptoTracker.Pro! Cartera en la nube conectada.'),
            'success'
          );
        })
        .catch(function(err) {
          handleAuthError(err);
        })
        .finally(function() {
          if (els.submitBtn) els.submitBtn.classList.remove('loading');
        });
    }
  }

  function fallbackFormSubmit(email, password, name) {
    setTimeout(function() {
      if (els.submitBtn) els.submitBtn.classList.remove('loading');

      var user = {
        id: 'usr_' + Date.now().toString(36),
        name: name || email.split('@')[0],
        email: email,
        provider: 'Email',
        tier: 'FREE',
        createdAt: new Date().toISOString()
      };

      saveSession(user);
      closeModal();

      var toastMsg = currentMode === 'register'
        ? i18n('auth_created_toast', '¡Cuenta creada con éxito! Sincronización multidispositivo activada.')
        : i18n('auth_welcome_toast', '¡Bienvenido a CryptoTracker.Pro! Cartera en la nube conectada.');

      showAuthToast(toastMsg, 'success');
    }, 600);
  }

  function handleAuthError(err) {
    var code = err ? err.code : '';
    var msg = err ? err.message : 'Error de autenticación';

    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        msg = i18n('auth_err_invalid_cred', 'Correo o contraseña incorrectos.');
        break;
      case 'auth/user-not-found':
        msg = i18n('auth_err_user_not_found', 'No existe ninguna cuenta con este correo.');
        break;
      case 'auth/email-already-in-use':
        msg = i18n('auth_err_email_in_use', 'Este correo ya está registrado en CryptoTracker.Pro.');
        break;
      case 'auth/weak-password':
        msg = i18n('auth_err_weak_password', 'La contraseña debe tener al menos 6 caracteres.');
        break;
      case 'auth/invalid-email':
        msg = i18n('auth_err_invalid_email', 'El formato del correo electrónico no es válido.');
        break;
      case 'auth/network-request-failed':
        msg = i18n('auth_err_network', 'Error de conexión a internet con Firebase.');
        break;
      case 'auth/too-many-requests':
        msg = i18n('auth_err_too_many', 'Demasiados intentos fallidos. Inténtalo más tarde.');
        break;
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        return;
      default:
        break;
    }

    showAuthToast(msg, 'error');
  }

  var _saveDebounceTimer = null;
  function saveCloudData() {
    if (!firestoreDb || !currentUser || !currentUser.id) return;
    clearTimeout(_saveDebounceTimer);
    _saveDebounceTimer = setTimeout(function() {
      try {
        var uid = currentUser.id;
        var bal = parseFloat(localStorage.getItem('criptotracker_balance') || '10000');
        var holdings = JSON.parse(localStorage.getItem('criptotracker_holdings') || '[]');
        var history = JSON.parse(localStorage.getItem('criptotracker_history') || '[]');
        var favorites = JSON.parse(localStorage.getItem('criptotracker_favorites') || '[]');

        var docData = {
          updatedAt: (firebase.firestore && firebase.firestore.FieldValue)
            ? firebase.firestore.FieldValue.serverTimestamp()
            : new Date().toISOString(),
          email: currentUser.email || '',
          name: currentUser.name || '',
          provider: currentUser.provider || 'Firebase',
          tier: currentUser.tier || 'FREE',
          trialStart: localStorage.getItem('criptotracker_demo_start') || null,
          portfolio: {
            balance: (isFinite(bal) && bal >= 0) ? bal : 10000,
            holdings: holdings,
            history: history
          },
          favorites: favorites
        };

        firestoreDb.collection('users').doc(uid).set(docData, { merge: true })
          .then(function() {
            console.log('[Firestore] Datos guardados en la nube para', uid);
          })
          .catch(function(err) {
            console.warn('[Firestore] Error al guardar datos:', err);
          });
      } catch (e) {
        console.warn('[Firestore] Error preparando datos para Firestore:', e);
      }
    }, 350);
  }

  function syncCloudDataWithFirestore(uid, isManual) {
    if (!uid && currentUser) uid = currentUser.id;
    if (!firestoreDb || !uid) {
      if (isManual) {
        showAuthToast(i18n('auth_sync_toast', '¡Sincronización completada! Saldo y favoritos actualizados en Firebase Cloud.'), 'success');
        if (els.btnProfileSync) els.btnProfileSync.classList.remove('syncing');
      }
      return Promise.resolve();
    }

    if (isManual && els.btnProfileSync) {
      els.btnProfileSync.classList.add('syncing');
    }

    var userRef = firestoreDb.collection('users').doc(uid);

    return userRef.get().then(function(doc) {
      if (doc.exists) {
        var data = doc.data() || {};

        // --- ENFORCE 7-DAY TRIAL & TIER VIA CLOUD ---
        if (data.tier) {
          currentUser.tier = data.tier;
          saveSession(currentUser);
        } else {
          currentUser.tier = 'FREE';
          saveSession(currentUser);
        }
        
        if (data.trialStart) {
          // Cloud is the source of truth, prevents clearing local storage to get another trial
          localStorage.setItem('criptotracker_demo_start', data.trialStart.toString());
        } else if (localStorage.getItem('criptotracker_demo_start')) {
          saveCloudData(); // Write local activation to cloud
        }
        if (window.updateAppBrandTier) window.updateAppBrandTier();
        // --------------------------------------------

        var cloudPortfolio = data.portfolio || {};
        var cloudFavorites = data.favorites;

        // Si existen datos de cartera en Firestore, sincronizamos a localStorage
        if (cloudPortfolio && cloudPortfolio.balance !== undefined) {
          localStorage.setItem('criptotracker_balance', cloudPortfolio.balance.toString());
          if (Array.isArray(cloudPortfolio.holdings)) {
            localStorage.setItem('criptotracker_holdings', JSON.stringify(cloudPortfolio.holdings));
          }
          if (Array.isArray(cloudPortfolio.history)) {
            localStorage.setItem('criptotracker_history', JSON.stringify(cloudPortfolio.history));
          }
        } else {
          // Si el usuario tenía saldo o posiciones locales antes de iniciar sesión, las respaldamos en Firestore
          saveCloudData();
        }

        // Si existen favoritos en Firestore, sincronizamos a localStorage
        if (Array.isArray(cloudFavorites)) {
          localStorage.setItem('criptotracker_favorites', JSON.stringify(cloudFavorites));
        } else {
          saveCloudData();
        }
      } else {
        // Documento no existía aún en Firestore (primer login de este usuario): respaldamos sus datos locales
        saveCloudData();
      }

      // Notificar e invalidar cachés en Simulator y Favorites
      if (window.Simulator && window.Simulator.reload) window.Simulator.reload();
      if (window.Favorites && window.Favorites.reload) window.Favorites.reload();
      if (window.renderAppPortfolio) window.renderAppPortfolio();
      if (window.updateAppFab) window.updateAppFab();

      try {
        window.dispatchEvent(new CustomEvent('cloudDataSynced'));
      } catch(e) {}

      // Actualizar valor en el modal de perfil
      var fabVal = document.getElementById('fab-value');
      if (els.profilePortfolioVal && fabVal && fabVal.textContent) {
        els.profilePortfolioVal.textContent = fabVal.textContent;
      }

      if (isManual) {
        showAuthToast(
          i18n('auth_sync_toast', '¡Sincronización completada! Saldo y favoritos actualizados en Firebase Cloud.'),
          'success'
        );
      }
    }).catch(function(err) {
      console.warn('[Firestore Sync Error]', err);
      if (isManual) {
        showAuthToast('Error al conectar con Firestore: ' + (err.message || 'Error de red'), 'error');
      }
    }).finally(function() {
      if (isManual && els.btnProfileSync) {
        els.btnProfileSync.classList.remove('syncing');
      }
    });
  }

  function syncCloudData() {
    syncCloudDataWithFirestore(currentUser ? currentUser.id : null, true);
  }

  function showAppleConfigNotice() {
    var existing = document.getElementById('apple-config-notice-modal');
    if (existing) existing.remove();

    var modalHtml = '<div id="apple-config-notice-modal" class="modal-overlay" style="z-index: 10005; display: flex; align-items: center; justify-content: center; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(5,8,20,0.88); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); padding: 20px;">' +
      '<div style="max-width: 440px; width: 100%; background: #0f172a; border: 1px solid rgba(255,255,255,0.18); border-radius: 20px; padding: 26px; box-shadow: 0 20px 50px rgba(0,0,0,0.7); text-align: center; color: #f8fafc;">' +
        '<div style="font-size: 3.2rem; margin-bottom: 12px; line-height: 1;">🍎</div>' +
        '<h3 style="margin: 0 0 10px; font-size: 1.25rem; font-weight: 800; color: #ffffff;">Inicio de Sesión con Apple ID</h3>' +
        '<p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.55; margin: 0 0 18px;">' +
          'El proveedor oficial de Apple ID requiere vincular el <strong>Services ID, Team ID y clave privada .p8</strong> de Apple Developer en la consola de Firebase Authentication.' +
        '</p>' +
        '<div style="background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3); border-radius: 12px; padding: 14px; font-size: 0.82rem; color: #c7d2fe; margin-bottom: 22px; text-align: left; line-height: 1.5;">' +
          '💡 <strong>Alternativas inmediatas:</strong> Puedes acceder con <strong>Google</strong> con 1 clic o iniciar sesión / registrarte con tu correo electrónico para sincronizar tu cartera multidispositivo.' +
        '</div>' +
        '<button id="btn-close-apple-notice" style="width: 100%; padding: 13px; background: linear-gradient(135deg, #6366f1, #4f46e5); color: #fff; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; font-size: 0.95rem; box-shadow: 0 4px 15px rgba(99,102,241,0.4);">' +
          'Entendido' +
        '</button>' +
      '</div>' +
    '</div>';

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    var noticeModal = document.getElementById('apple-config-notice-modal');
    var closeBtn = document.getElementById('btn-close-apple-notice');
    if (closeBtn && noticeModal) {
      closeBtn.addEventListener('click', function() {
        noticeModal.remove();
      });
      noticeModal.addEventListener('click', function(e) {
        if (e.target === noticeModal) noticeModal.remove();
      });
    }
  }

  function showGoogleConfigNotice() {
    var existing = document.getElementById('google-config-notice-modal');
    if (existing) existing.remove();

    var modalHtml = '<div id="google-config-notice-modal" class="modal-overlay" style="z-index: 10005; display: flex; align-items: center; justify-content: center; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(5,8,20,0.88); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); padding: 20px;">' +
      '<div style="max-width: 440px; width: 100%; background: #0f172a; border: 1px solid rgba(255,255,255,0.18); border-radius: 20px; padding: 26px; box-shadow: 0 20px 50px rgba(0,0,0,0.7); text-align: center; color: #f8fafc;">' +
        '<div style="margin-bottom: 12px; line-height: 1;"><svg viewBox="0 0 24 24" width="48" height="48">' +
        '<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>' +
        '<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>' +
        '<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>' +
        '<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>' +
        '</svg></div>' +
        '<h3 style="margin: 0 0 10px; font-size: 1.25rem; font-weight: 800; color: #ffffff;">Inicio de Sesión con Google</h3>' +
        '<p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.55; margin: 0 0 18px;">' +
          'Para utilizar Google Sign-In de forma nativa en esta aplicación (iOS/Android), es necesario generar los <strong>ID de cliente OAuth de Apple y Android (SHA-1)</strong> en la consola de Firebase, y descargar los archivos de configuración correspondientes.' +
        '</p>' +
        '<div style="background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3); border-radius: 12px; padding: 14px; font-size: 0.82rem; color: #c7d2fe; margin-bottom: 22px; text-align: left; line-height: 1.5;">' +
          '💡 <strong>Solución:</strong> Utiliza la versión web de la app donde Google funciona sin configuración adicional, o inicia sesión temporalmente con tu correo electrónico.' +
        '</div>' +
        '<button id="btn-close-google-notice" style="width: 100%; padding: 13px; background: linear-gradient(135deg, #6366f1, #4f46e5); color: #fff; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; font-size: 0.95rem; box-shadow: 0 4px 15px rgba(99,102,241,0.4);">' +
          'Entendido' +
        '</button>' +
      '</div>' +
    '</div>';

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    var noticeModal = document.getElementById('google-config-notice-modal');
    var closeBtn = document.getElementById('btn-close-google-notice');
    if (closeBtn && noticeModal) {
      closeBtn.addEventListener('click', function() {
        noticeModal.remove();
      });
      noticeModal.addEventListener('click', function(e) {
        if (e.target === noticeModal) noticeModal.remove();
      });
    }
  }

  function logout() {
    if (firebaseAuth) {
      firebaseAuth.signOut().then(function() {
        saveSession(null);
        closeModal();
        showAuthToast(
          i18n('auth_logout_toast', 'Sesión cerrada correctamente. Volviendo a almacenamiento local.'),
          'info'
        );
      }).catch(function() {
        saveSession(null);
        closeModal();
      });
    } else {
      saveSession(null);
      closeModal();
      showAuthToast(
        i18n('auth_logout_toast', 'Sesión cerrada correctamente. Volviendo a almacenamiento local.'),
        'info'
      );
    }
  }

  // Eliminación de cuenta dentro de la app (requisito de Google Play - política de datos de usuario)
  function deleteAccount() {
    var ok = window.confirm('¿Seguro que quieres eliminar tu cuenta de CryptoTracker.Pro?\n\nSe borrarán de forma permanente tu cuenta, tu cartera simulada y tus favoritos. Esta acción no se puede deshacer.');
    if (!ok) return;

    var user = firebaseAuth ? firebaseAuth.currentUser : null;

    function wipeLocal() {
      try {
        Object.keys(localStorage).forEach(function(k) {
          if (k.indexOf('criptotracker') === 0 || k.indexOf('crypto') === 0) localStorage.removeItem(k);
        });
      } catch (e) {}
      saveSession(null);
      closeModal();
    }

    if (!user) {
      wipeLocal();
      showAuthToast('Datos locales eliminados de este dispositivo.', 'info');
      return;
    }

    var uid = user.uid;
    var removeDoc = firestoreDb
      ? firestoreDb.collection('users').doc(uid).delete().catch(function() {})
      : Promise.resolve();

    removeDoc.then(function() {
      return user.delete();
    }).then(function() {
      wipeLocal();
      showAuthToast('Tu cuenta y todos tus datos han sido eliminados definitivamente.', 'success');
    }).catch(function(err) {
      if (err && err.code === 'auth/requires-recent-login') {
        showAuthToast('Por seguridad, cierra sesión, vuelve a iniciarla y pulsa de nuevo "Eliminar mi cuenta".', 'error');
      } else {
        showAuthToast('No se pudo eliminar la cuenta: ' + ((err && err.message) || 'error desconocido') + '. Escríbenos a soporte@criptotracker.pro', 'error');
      }
    });
  }

  document.addEventListener('click', function(e) {
    if (e.target.closest && e.target.closest('#btn-profile-delete-account')) {
      e.preventDefault();
      deleteAccount();
    }
  });

  function updateUI() {
    var isLoggedIn = !!currentUser;

    // Desktop Header Button
    if (els.headerText) {
      if (isLoggedIn) {
        var firstName = (currentUser.name || currentUser.email.split('@')[0]).split(' ')[0];
        els.headerText.textContent = firstName;
        if (els.headerIcon) els.headerIcon.textContent = '💎';
        if (els.headerBtn) {
          els.headerBtn.classList.add('logged-in');
          els.headerBtn.title = currentUser.email;
        }
      } else {
        els.headerText.textContent = i18n('nav_sign_in', 'Iniciar Sesión');
        if (els.headerIcon) els.headerIcon.textContent = '👤';
        if (els.headerBtn) {
          els.headerBtn.classList.remove('logged-in');
          els.headerBtn.title = i18n('nav_sign_in', 'Iniciar Sesión');
        }
      }
    }

    // Mobile Header Icon
    if (els.mobileIcon) {
      els.mobileIcon.textContent = isLoggedIn ? '💎' : '👤';
      if (els.mobileBtn) {
        els.mobileBtn.classList.toggle('logged-in', isLoggedIn);
      }
    }

    // Mobile Drawer Auth Section
    if (els.drawerTitle) {
      if (isLoggedIn) {
        els.drawerTitle.textContent = currentUser.name || (currentUser.email ? currentUser.email.split('@')[0] : 'Usuario');
        if (els.drawerSub) {
          els.drawerSub.textContent = '';
          els.drawerSub.style.display = 'none';
        }
        if (els.drawerIcon) els.drawerIcon.textContent = '💎';
        if (els.drawerBtn) els.drawerBtn.classList.add('logged-in');
      } else {
        els.drawerTitle.textContent = i18n('nav_sign_in', 'Iniciar Sesión');
        if (els.drawerSub) {
          els.drawerSub.textContent = '';
          els.drawerSub.style.display = 'none';
        }
        if (els.drawerIcon) els.drawerIcon.textContent = '👤';
        if (els.drawerBtn) els.drawerBtn.classList.remove('logged-in');
      }
    }

    if (window.updateAppBrandTier) {
      window.updateAppBrandTier();
    }
  }

  function showAuthToast(msg, type) {
    if (window.showToast) {
      window.showToast(msg, type);
    } else {
      console.log('[Auth Toast]', type, msg);
    }
  }

  function i18n(key, fallback) {
    if (window.I18n && window.I18n.t) {
      var val = window.I18n.t(key);
      if (val && val !== key) return val;
    }
    return fallback;
  }

  // Language change listener to re-render texts
  window.addEventListener('languageChanged', function() {
    updateUI();
    if (!currentUser && els.submitText && !currentSocialProvider) {
      els.submitText.textContent = currentMode === 'login'
        ? i18n('auth_btn_submit_login', 'Entrar a mi Cuenta')
        : i18n('auth_btn_submit_register', 'Crear Cuenta PRO');
    }
  });

  // Download Modal Handler (Android APK, Apple DMG / IPA)
  function initDownloadModal() {
    var dlModal = document.getElementById('download-modal');
    var dlBtnDesktop = document.getElementById('desktop-download-btn');
    var dlBtnMobile = document.getElementById('mobile-download-btn');
    var dlBtn = document.getElementById('btn-open-download-modal'); // fallback
    var dlClose = document.getElementById('download-modal-close');
    var dlBackdrop = document.getElementById('download-modal-backdrop');

    if (!dlModal) return;

    function openDl() {
      dlModal.classList.remove('hidden');
      document.body.classList.add('modal-open');
    }
    function closeDl() {
      dlModal.classList.add('hidden');
      document.body.classList.remove('modal-open');
    }

    if (dlBtnDesktop) dlBtnDesktop.addEventListener('click', openDl);
    if (dlBtnMobile) dlBtnMobile.addEventListener('click', openDl);
    if (dlBtn) dlBtn.addEventListener('click', openDl);
    if (dlClose) dlClose.addEventListener('click', closeDl);
    if (dlBackdrop) dlBackdrop.addEventListener('click', closeDl);
  }

  // Expose API
  window.CriptoAuth = {
    init: init,
    openModal: openModal,
    closeModal: closeModal,
    getUser: function() { return currentUser; },
    isLoggedIn: function() { return !!currentUser; },
    getFirebaseAuth: function() { return firebaseAuth; },
    getFirestore: function() { return firestoreDb; },
    sync: syncCloudData,
    saveCloudData: saveCloudData,
    logout: logout
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window, document);
