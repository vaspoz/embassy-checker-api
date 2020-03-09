(function () {
    var script = document.createElement("script");
    script.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js");
    script.addEventListener('load', function () {
        var script = document.createElement("script");
        document.body.appendChild(script);
        console.log('jQuery injected');
    }, false);
    document.body.appendChild(script)
})()

setTimeout(() => {
    $("#ctl00_MainContent_txtID").val('38704');
    $("#ctl00_MainContent_txtUniqueID").val('24E6A7C7');
    $("#ctl00_MainContent_txtCode").val('24E6A7C7');

    $("#ctl00_MainContent_ButtonA").click();

    setTimeout(() => {
        $("#ctl00_MainContent_CheckBoxList1_0").click();
        $("#ctl00_MainContent_ButtonQueue").click();
    }, 5000);
}, 2000);

