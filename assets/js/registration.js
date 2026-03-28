$(document).ready(function () {

  toastr.options = {
      "positionClass": "toast-bottom-center", // Bottom left corner
      "timeOut": "3000",             // Auto hide after 3s
      "extendedTimeOut": "1000",
      "preventDuplicates": true
  };

  limitBirthdate();
  maskContactNumber();
  loadBatchYear();

  // Basic Info -> Ride Category
  $('#btn-next-basic').click(function() {
      if (validateCurrentTab('#tab-basic')) {
          $('#tab-ride-tab').tab('show');
      }
  });

  // Ride Category -> Payment
  $('#btn-next-ride').click(function() {
      if (validateCurrentTab('#tab-ride')) {
          $('#tab-payment-tab').tab('show');
      }
  });

  // Payment -> Success
  $('#btn-next-payment').click(function() {
      if (validateCurrentTab('#tab-payment')) {
          $('#tab-success-tab').tab('show');
      }
  });

  // Back buttons don’t need validation
  $('#btn-back-ride').click(function() { $('#tab-basic-tab').tab('show'); });
  $('#btn-back-payment').click(function() { $('#tab-ride-tab').tab('show'); });

  // Optional: validate on form submit
  $('#frm-registration').on('submit', function(e) {
    e.preventDefault();
    
    let contactNumber = $('#inp-contact').cleanVal(); // get digits only
    if (contactNumber.length > 0 && contactNumber.length !== 11) {
        toastr.error("Contact number must be exactly 11 digits.");
        return;
    }
  
    const runner = {
          firstName: $('#inp-firstname').val(),
          lastName: $('#inp-lastname').val(),
          gender: $('#inp-gender').val(),
          birthdate: $('#inp-birthdate').val(),
          batchYear: $('#inp-batchyear').val(),
          contact: $('#inp-contact').val(),
          address: $('#inp-address').val(),
          tshirtSize: $('#inp-tshirt').val()
      };

      // const btnRegister = $('#btn-register');
      // btnRegister.prop('disabled', true).text('Registered: Directing to QR Code...');
      toastr.success("Successfully registered. For payment and activation, please contact your batch officer.");

    
      // // Wait 4 seconds (4000ms) before executing
      // setTimeout(function() {
      //     btnRegister.prop('disabled', false).text('Register');
      //     window.location.href = "qrcode.html";
      // }, 10000);
  });

  function loadBatchYear(){
    const currentYear = 2026;
    const startYear = currentYear - 70;

    let options = '<option value="" selected>N/A</option>';

    for (let year = currentYear; year >= startYear; year--) {
        options += `<option value="${year}">${year}</option>`;
    }

    $('#sel-batch-year').html(options);
  }

  function limitBirthdate(){
    // Get today's date
    let today = new Date();
    // Calculate date 10 years ago
    let year = today.getFullYear() - 10;
    let month = (today.getMonth() + 1).toString().padStart(2, '0'); // month is 0-indexed
    let day = today.getDate().toString().padStart(2, '0');
    let maxDate = `${year}-${month}-${day}`;

    // Set max attribute of birthdate input
    $('#inp-birthdate').attr('max', maxDate);
  }

  function maskContactNumber(){
    // Apply Philippine phone mask: 0912-345-6789
    $('#inp-contact').mask('0000-000-0000', {
        placeholder: "0912-345-6789"
    });
  }

  function validateCurrentTab(tabPane) {
      let isValid = true;

      // Check all visible required inputs/selects
      $(tabPane).find('input[required], select[required]').each(function() {
          if (!this.checkValidity()) {
              this.reportValidity(); // browser tooltip
              isValid = false;
              return false; // stop on first invalid
          }
      });

      // Special validation for Ride Category tab
      if (tabPane === '#tab-ride') {
          if ($('input[name="rideCategory"]:checked').length === 0) {
              toastr.error("Please select a Ride Category (3km or 6km).");
              isValid = false;
          }
      }

      return isValid;
  }

});
