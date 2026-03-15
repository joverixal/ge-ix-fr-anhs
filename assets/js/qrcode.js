$(document).ready(function() {
  // Example GUID, in real app replace with user's unique ID
  const guidId = '123e4567-e89b-12d3-a456-426614174000';

  // Generate QR code
  $('#qrcode').qrcode({
      text: guidId,
      width: 250,
      height: 250,
      colorDark : "#000000",
      colorLight : "#ffffff"
  });

  // Download QR code
  $('#btn-download').click(function(){
      const canvas = $('#qrcode canvas')[0]; // get the canvas element
      if(canvas) {
          const link = document.createElement('a');
          link.href = canvas.toDataURL("image/png");
          link.download = 'ANHS2011_QR.png';
          link.click();
          toastr.success("QR Code downloaded!");
      } else {
          toastr.error("QR Code not available!");
      }
  });
});
