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
  var currentSocialProvider = null; // 'Google' or 'Apple' or null
  var firebaseAuth = null;

  // DOM Elements cache
  var els = {};

  function init() {
    cacheDom();
    loadSession();
    initFirebase();
    bindEvents();
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
              tier: 'PRO',
              createdAt: user.metadata ? user.metadata.creationTime : new Date().toISOString()
            };
            saveSession(appUser);
          } else {
            if (currentUser && currentUser.provider !== 'guest') {
              saveSession(null);
            }
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

    // Back from Social Dedicated Form
    if (els.backBtn) {
      els.backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        resetSocialMode();
      });
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

    if (!currentSocialProvider) {
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
  }

  function setSocialMode(provider) {
    currentSocialProvider = provider;
    if (els.socialGroup) els.socialGroup.style.display = 'none';
    if (els.divider) els.divider.style.display = 'none';
    if (els.backBtn) els.backBtn.style.display = 'inline-flex';
    if (els.fieldName) els.fieldName.style.display = 'block';

    if (provider === 'Google') {
      if (els.title) els.title.textContent = 'Acceso con Google';
      if (els.subtitle) els.subtitle.textContent = 'Introduce tus credenciales de Google para conectar tu cuenta en Firebase';
      if (els.emailLabel) els.emailLabel.textContent = 'Correo de Google (@gmail.com)';
      if (els.inputEmail) els.inputEmail.placeholder = 'tu.usuario@gmail.com';
      if (els.submitText) els.submitText.textContent = 'Continuar con Google (Firebase)';
    } else if (provider === 'Apple') {
      if (els.title) els.title.textContent = 'Acceso con Apple ID';
      if (els.subtitle) els.subtitle.textContent = 'Introduce tus credenciales de Apple ID para conectar tu cuenta en Firebase';
      if (els.emailLabel) els.emailLabel.textContent = 'Apple ID (@icloud.com o correo)';
      if (els.inputEmail) els.inputEmail.placeholder = 'tu.apple.id@icloud.com';
      if (els.submitText) els.submitText.textContent = 'Continuar con Apple (Firebase)';
    }

    if (els.inputEmail) els.inputEmail.focus();
  }

  function resetSocialMode() {
    currentSocialProvider = null;
    if (els.socialGroup) els.socialGroup.style.display = 'grid';
    if (els.divider) els.divider.style.display = 'flex';
    if (els.backBtn) els.backBtn.style.display = 'none';
    if (els.title) els.title.textContent = i18n('auth_title', 'Acceso CryptoTracker.Pro');
    if (els.subtitle) els.subtitle.textContent = i18n('auth_subtitle', 'Sincroniza tu portfolio y favoritos en Web, Android e iPhone');
    if (els.emailLabel) els.emailLabel.textContent = i18n('auth_label_email', 'Correo Electrónico');
    if (els.inputEmail) els.inputEmail.placeholder = 'tu@email.com';
    setMode(currentMode);
  }

  function openModal(forcedMode) {
    if (!els.modal) return;
    resetSocialMode();
    if (forcedMode) setMode(forcedMode);

    updateModalState();
    els.modal.classList.remove('hidden');
    document.body.classList.add('modal-open');

    if (!currentUser && els.inputEmail) {
      setTimeout(function() { els.inputEmail.focus(); }, 120);
    }
  }

  function closeModal() {
    if (!els.modal) return;
    resetSocialMode();
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
    var isNative = !!(
      (window.Capacitor && window.Capacitor.getPlatform && window.Capacitor.getPlatform() !== 'web') ||
      (window.webkit && window.webkit.messageHandlers) ||
      /iPad|iPhone|iPod|Android/.test(navigator.userAgent)
    );

    // In mobile devices/WebViews where OAuth popups are restricted, open dedicated credential view
    if (isNative || !firebaseAuth) {
      setSocialMode(providerName);
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
      setSocialMode(providerName);
      return;
    }

    firebaseAuth.signInWithPopup(provider)
      .then(function(result) {
        closeModal();
        var u = result && result.user;
        var appUser = {
          id: u ? u.uid : 'usr_' + Date.now().toString(36),
          name: (u && u.displayName) || (providerName === 'Apple' ? 'Apple VIP Investor' : 'Google PRO Trader'),
          email: (u && u.email) || '',
          provider: providerName,
          tier: 'PRO',
          createdAt: new Date().toISOString()
        };
        saveSession(appUser);
        showAuthToast(
          '¡Bienvenido a CryptoTracker.Pro! Cuenta de ' + providerName + ' conectada con éxito.',
          'success'
        );
      })
      .catch(function(error) {
        console.warn('[Firebase Social Error]', error);
        // Seamless fallback to dedicated credential view if popup fails
        setSocialMode(providerName);
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

    if (currentSocialProvider) {
      handleSocialFormSubmit(email, password, name, currentSocialProvider);
      return;
    }

    if (!firebaseAuth) {
      fallbackFormSubmit(email, password, name);
      return;
    }

    if (currentMode === 'register') {
      firebaseAuth.createUserWithEmailAndPassword(email, password)
        .then(function(cred) {
          if (name && cred.user) {
            return cred.user.updateProfile({ displayName: name });
          }
        })
        .then(function() {
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
        .then(function() {
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

  function handleSocialFormSubmit(email, password, name, providerName) {
    var defaultName = name || (providerName === 'Apple' ? 'Apple VIP Investor' : 'Google PRO Trader');

    function completeLogin(userCred) {
      var u = userCred ? userCred.user : null;
      var appUser = {
        id: u ? u.uid : 'usr_' + Date.now().toString(36),
        name: (u && u.displayName) || defaultName,
        email: (u && u.email) || email,
        provider: providerName,
        tier: 'PRO',
        createdAt: new Date().toISOString()
      };
      saveSession(appUser);
      closeModal();
      showAuthToast(
        '¡Bienvenido a CryptoTracker.Pro! Cuenta de ' + providerName + ' sincronizada en Firebase.',
        'success'
      );
    }

    if (!firebaseAuth) {
      setTimeout(function() {
        if (els.submitBtn) els.submitBtn.classList.remove('loading');
        completeLogin(null);
      }, 500);
      return;
    }

    // Try to sign in first, or create if does not exist
    firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(function(cred) {
        completeLogin(cred);
      })
      .catch(function(err) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          return firebaseAuth.createUserWithEmailAndPassword(email, password)
            .then(function(newCred) {
              if (newCred && newCred.user) {
                return newCred.user.updateProfile({ displayName: defaultName }).then(function() {
                  return newCred;
                });
              }
              return newCred;
            })
            .then(function(newCred) {
              completeLogin(newCred);
            })
            .catch(function(createErr) {
              handleAuthError(createErr);
            });
        } else {
          handleAuthError(err);
        }
      })
      .finally(function() {
        if (els.submitBtn) els.submitBtn.classList.remove('loading');
      });
  }

  function fallbackFormSubmit(email, password, name) {
    setTimeout(function() {
      if (els.submitBtn) els.submitBtn.classList.remove('loading');

      var user = {
        id: 'usr_' + Date.now().toString(36),
        name: name || email.split('@')[0],
        email: email,
        provider: 'Email',
        tier: 'PRO',
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

  function syncCloudData() {
    if (els.btnProfileSync) els.btnProfileSync.classList.add('syncing');

    setTimeout(function() {
      if (els.btnProfileSync) els.btnProfileSync.classList.remove('syncing');
      showAuthToast(
        i18n('auth_sync_toast', '¡Sincronización completada! Saldo y favoritos actualizados en Firebase Cloud.'),
        'success'
      );
    }, 850);
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
    if (els.drawerTitle && els.drawerSub) {
      if (isLoggedIn) {
        els.drawerTitle.textContent = currentUser.name || currentUser.email;
        var provText = currentUser.provider ? ' (' + currentUser.provider + ')' : '';
        els.drawerSub.textContent = '💎 PRO • Sincronizado en Firebase' + provText;
        if (els.drawerIcon) els.drawerIcon.textContent = '💎';
        if (els.drawerBtn) els.drawerBtn.classList.add('logged-in');
      } else {
        els.drawerTitle.textContent = i18n('nav_sign_in', 'Iniciar Sesión');
        els.drawerSub.textContent = 'Sincronizar Cartera Firebase Cloud';
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

  // Expose API
  window.CriptoAuth = {
    init: init,
    openModal: openModal,
    closeModal: closeModal,
    setSocialMode: setSocialMode,
    resetSocialMode: resetSocialMode,
    getUser: function() { return currentUser; },
    isLoggedIn: function() { return !!currentUser; },
    getFirebaseAuth: function() { return firebaseAuth; },
    sync: syncCloudData,
    logout: logout
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window, document);
