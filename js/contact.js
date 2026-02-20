$('#contacts').on('submit', function (e) {
  e.preventDefault();

  var recipient = 'info@strettymusic.com';
  var subject = encodeURIComponent('Stretty website contact');
  var body = encodeURIComponent('Hi Stretty,');
  var mailtoUrl = 'mailto:' + recipient + '?subject=' + subject + '&body=' + body;

  window.location.href = mailtoUrl;
});
