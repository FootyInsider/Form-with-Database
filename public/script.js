document.getElementById('confirmPassword').addEventListener('input', function() {
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
      document.getElementById('error-message').style.display = 'block';
    } else {
      document.getElementById('error-message').style.display = 'none';
    }
  });

document.getElementById('nationality').addEventListener('change', function() {
    var nationality = document.getElementById('nationality').value;
    var nonNigerianField = document.getElementById('nonNigerianField');
    var nigerianField = document.getElementById('nigerianField');

    if (nationality === 'non-nigerian') {
    nonNigerianField.style.display = 'block';
    nigerianField.style.display = 'none';
    document.getElementById('nonNigerianNationality').required = true;
    document.getElementById('stateOfOrigin').required = false;
    } 
    else {
    nonNigerianField.style.display = 'none';
    nigerianField.style.display = 'block';
    document.getElementById('nonNigerianNationality').required = false;
    document.getElementById('stateOfOrigin').required = true;
    }
});    