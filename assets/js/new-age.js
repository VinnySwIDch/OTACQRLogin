var qrCodeScanned = false;
var qrScannerInit = false;

function onScanSuccess(qrCodeMessage, decodedResult)
{
    if (qrCodeScanned)
    {
         html5QrcodeScanner.clear().then(_ => {
            // the UI should be cleared here      
          }).catch(error => {
            // Could not stop scanning for reasons specified in `error`.
            // This conditions should ideally not happen.
          });
        return;
    }
    qrCodeScanned = true;
    $("#reader").hide();
    $("#wait").show();
                
    console.log(decodedResult);
    verifyOTAC(qrCodeMessage);
}

function onScanFailure(error) 
{
    $("button").addClass("btn btn-primary btn-user w-100");
    $("select").addClass("btn btn-secondary dropdown-toggle btn-user w-100 mb-2");
    $("#reader").css("border", "0px");
    $("#html5-qrcode-anchor-scan-type-change").hide();
}
function verifyOTAC(qrCodeMessage) 
{
    var dataStr = JSON.stringify({
        apiKey: "PLC_567052367261557962726962304c69424b374546433867766b4a314a33715851",
        systemId: "1",
        otac: qrCodeMessage,
        pcDeviceId: "127.0.0.1",
        plcDeviceId: "192.168.1.10",
    });
    $.ajax({
        url: "https://otacapiproxy.glitch.me/",
        type: "POST",
        crossDomain: true,
        //async: true,
        headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    accept: "application/json",
                },
        dataType: "json",
        data: dataStr,
        }).then(function (data) 
                {
                    console.log(data);
                    if (data.result == "SUCCESS")
                    {
                        window.location.replace("index.html?userId=" + data.userId);
                    }
                    else 
                    {
                        qrCodeScanned = false;
                        $("#alert").show();
                        $("#reader").show();
                        $("#wait").hide();
                    }
        /*
        var text = "<h4>Scan Result </h4> <table border='0'>";
        for (var x in data) {
            text +=
            "<tr><td>" + x + "</td><td>:</td><td>" + data[x] + "</td></tr>";
        }
        text += "</table>";
        $("#result").html(text);
        */
    });
}

function loginClicked()
{
    if($("#inputOTAC").val().length > 0)
    {
        $("#wait").show();
        $("#reader").hide();
        verifyOTAC($("#inputOTAC").val());
    }
    else 
    {
        $("#alert").show();
    }
        
}

$(document).ready(function() 
{
    if (!qrScannerInit)
        onScanFailure("");
    qrScannerInit = true;
});


let searchParams = new URLSearchParams(window.location.search)

if($("#reader").length)
{
    let html5QrcodeScanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: {width: 250, height: 250} },
                /* verbose= */ false);

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}
else if(!searchParams.has("userId"))
    window.location.replace("login.html");
else
    $("#userId").html(searchParams.get("userId"));