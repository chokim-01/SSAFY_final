(function() {
    console.log("123");
    var div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = 0;
    div.style.right = 0;
    div.textContent = 'hello, world';
    document.body.appendChild(div);
})();

