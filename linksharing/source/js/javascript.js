$(function() {
  var digits = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  var randomid = "";
  var connctID;
  var peer;
  var usernm;
  var call;
  var ref = firebase.database().ref('users/');

  // getUrlParameter = function(name) {
  //     var results = new RegExp('[\#&]' + name + '=([^&#]*)').exec(window.location.href);
  //     if (results == null) {
  //         return null;
  //     } else {
  //         return results[1] || 0;
  //     }
  // }


    for (i = 0; i < 10; i++) {
      var rt = digits[Math.floor(Math.random() * 62)];
      randomid += rt;
    }
    runpeer();


  function runpeer() {
    peer = new Peer(randomid, { host: '192.168.1.4', port: 9000, path: '/peerjs' });
    peer.on('open', function(id) {
      console.log('My peer ID is: ' + id);
      if($("#qrcode").length){
        $('#qrcode').qrcode(id);
      }
      
    });
    
    if($("video").length){
      let scanner = new Instascan.Scanner({ video: document.getElementById('preview'), mirror:false });
      scanner.addListener('scan', function (content) {
        $(".scanned-data").append(content)
        connctID = content + '';
        connpeer(connctID);
        localStorage.setItem("connectedwith", connctID);
      });
      Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length === 1) {
          scanner.start(cameras[0]);
        } 
        else if(cameras.length === 2){
          scanner.start(cameras[1]);
        }
        else {
          console.error('No cameras found.');
        }
      }).catch(function (e) {
        console.error(e);
      });
    }

    

    

    peer.on('error', function(err) {
      if (err.type == 'unavailable-id') {
        alert("id is taken");
      }
    });
    peer.on('connection', function(conn) {
      console.log(conn.peer + " is connected with you");
      $(".test").append($(".msg").val())
      setTimeout(function(){
        conn.send("azhar");
      }, 1000)
      if (localStorage.getItem("connectedwith") != conn.peer) {
        connpeer(conn.peer);
        
        
      }

      conn.on('data', function(data) {
        window.navigator.vibrate(200);
        if(data !== ""){
          
          window.open(data,"_self")
        }
        
      });
    });
    // peer.on('disconnected', function() {
    //     console.log("disconnected");
    //      peer.reconnect();
    // });
    // peer.on('close', function() {
    //     console.log("close");
    // });
  }

  function connpeer(connthis) {
    conn = peer.connect(connthis);
    conn.on('open', function() {
      
      var getmsg = $("#msg").val();
    conn.send(getmsg);
      
    });
  }

  $("#sendbtn").click(function() {
    var getmsg = $("#msg").val();
    conn.send(getmsg);
    
  });
  // $(".clearchat").click(function() {
  //   var confirmclear = confirm("This will clear chat for both users.");
  //   if (confirmclear == true) {
  //     conn.send("vjdpcsdoJHVDjhb87%%^89(*xcvnxdhc");
  //     $(".msgs ul").empty();
  //   }
  // });

  // function scrolltotop() {
  //   $('.msgs').scrollTop($('.msgs').prop("scrollHeight"));
  // }

  // function selectText() {
  //   $("#userName").select();
  // }
  // $(window).bind('beforeunload', function() {
  //   return 'It will close the current chat';
  // });
});
