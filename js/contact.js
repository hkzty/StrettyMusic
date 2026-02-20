$('#contacts').on('submit', function (e) {
    e.preventDefault();
    var mailto = 'mailto:info@strettymusic.com?subject=' + encodeURIComponent('Stetty Contact');
    window.location.href = mailto;
});
