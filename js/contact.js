$('#contacts').on('submit', function (e) {
    e.preventDefault();
    window.location.href = 'mailto:info@strettymusic.com?subject=' + encodeURIComponent('Stetty inquiry');
});
