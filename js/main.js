var firebase = null;


$(function() {
    firebase = new Firebase("https://knightoftheoldcode.firebaseio.com");
    
    // Register the callback to be fired every time auth state changes
    firebase.onAuth(authDataCallback);
    
    $("#auth-link").click(function(event){

        event.preventDefault();

        var authData = firebase.getAuth();
        if (authData) {
            signout();
        } else {
            signin();
        }

        return false; //for good measure
    });

    $("#contact-test-link").click(function(event){
//        firebase.child("test").push({name: "blah"});
        
        event.preventDefault();

        firebase.child("test").push("I'm writing data", function(error) {
          if (error) {
            alert("Data could not be saved." + error);
          } else {
            alert("Data saved successfully.");
          }
        });

        return false; //for good measure
    });
});

function signin() {
//    firebase.authAnonymously(authHandler);
    firebase.authWithOAuthPopup("github", authHandler);
}

function signout() {
    var authData = firebase.getAuth();
    if (authData) {
      firebase.unauth();
    } else {
      console.log("can't logout if not logged in");
    }
}

// Create a callback which logs the current auth state
function authDataCallback(authData) {
  if (authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
      $('#auth-link').text("Sign out");
      saveUser();
  } else {
    console.log("User is logged out");
      $('#auth-link').text("Sign in");
  }
}



// Create a callback to handle the result of the authentication
function authHandler(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
  }
}

function abunchofauths() {
    // Authenticate users with a custom Firebase token
    firebase.authWithCustomToken("<token>", authHandler);
    // Alternatively, authenticate users anonymously
    firebase.authAnonymously(authHandler);
    // Or with an email/password combination
    firebase.authWithPassword({
      email    : 'bobtony@firebase.com',
      password : 'correcthorsebatterystaple'
    }, authHandler);
    // Or via popular OAuth providers ("facebook", "github", "google", or "twitter")
    firebase.authWithOAuthPopup("<provider>", authHandler);
    firebase.authWithOAuthRedirect("<provider>", authHandler);
}

function saveUser() {
    // we would probably save a profile when we register new users on our site
    // we could also read the profile to see if it's null
    // here we will just simulate this with an isNewUser boolean
    var isNewUser = true;
    firebase.onAuth(function(authData) {
      if (authData && isNewUser) {
        // save the user's profile into Firebase so we can list users,
        // use them in Security and Firebase Rules, and show profiles
        firebase.child("users").child(authData.uid).set(authData);
      }
    });
}



$(document).ready(function() {
  var menuToggle = $('#js-mobile-menu').unbind();
  $('#js-navigation-menu').removeClass("show");

  menuToggle.on('click', function(e) {
    e.preventDefault();
    $('#js-navigation-menu').slideToggle(function(){
      if($('#js-navigation-menu').is(':hidden')) {
        $('#js-navigation-menu').removeAttr('style');
      }
    });
  });
});