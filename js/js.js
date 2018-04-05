function SelectText(element) {
    var doc = document;
    var text = doc.getElementById(element);
    if (doc.body.createTextRange) { // ms
        var range = doc.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = doc.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);

    }
}

function passwordGen(limit) {
    limit = limit || 8;

    var password = '';

    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:;><!"$%&/()=?^*#_-@+[]{}|,.';

    var list = chars.split('');
    var len = list.length, i = 0;

    do {

        i++;

        var index = Math.floor(Math.random() * len);

        password += list[index];

    } while (i < limit);

    return password;
}

function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(https?|ftp|file|mailto|bitcoin|callto|ed2k|git|gtalk|irc|irc6|ircs|jabber|magnet|market|skype|tel):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp, "<a href='$1' target='_new'>$1</a>");
}
function nl2br(str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

function htmlEncode(value) {
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html();
}


function eachActiveConnection(fn) {
    var actives = $('.active');
    var checkedIds = {};
    actives.each(function () {
        var peerId = $(this).attr('id');

        if (!checkedIds[peerId]) {
            var conns = peer.connections[peerId];
            if(typeof conns != 'undefined'){
                for (var i = 0, ii = conns.length; i < ii; i += 1) {
                    var conn = conns[i];
                    fn(conn, $(this));
                }
            }
        }

        checkedIds[peerId] = 1;
    });
}

function formatFinger(str) {
    var splitStringArray = str.split("");
    var finalString = "";
    var step = 0;
    for (var i = 0; i < splitStringArray.length; i++) {
        finalString += splitStringArray[i];
        step++;
        if (step == 8) {
            finalString += " ";
            step = 0;
        }
    }
    return finalString;
}


function snobuddyOn(data) {
    eachActiveConnection(function (c, $c) {
        if (c.label === 'chat') {
            //console.log(c.peer+":"+data);
            //if(data != "-=pNg=-") {
            if (data != '-=?OTR?=-') {
                if (!isMute) {
                    $('#chatAudio')[0].play();
                }
                nMessages += 1;
                var subMsg = data.substr(0, 5);
                //console.log(subMsg);

                var messageBox = $c.find('.messages');
                if(subMsg != '?MSG:') data = replaceURLWithHTMLLinks(nl2br(htmlEncode(data)));
                 else {
                    data = '<i class="fa fa-paperclip fa-2x"></i>&nbsp;'+data.substr(5);
                }
                messageBox.append('<div><span class="peer">' + c.peer + '</span>: ' + data + '</div>');
                messageBox.scrollTop(messageBox[0].scrollHeight);
                if (!isFocus) {
                    flashTitle("(" + nMessages + ") " + dTitle, 100000000);
                }
                //$(document).prop('title',"("+nMessages+") "+dTitle);
            }
            else {
                $('#otron').trigger('click');
            }
            //}
            //else {
            //firstPng = true;
            //lastPng = (new Date()).getTime();
            //}
        }
        //if(firstPng && !isStarted) {
    });
}

function sbuddyOn(data) {
    //console.log("OTHER OTR:" + data);
    buddy.receiveMsg(data);
    if (firstPng && isStarted && !isFinger) {
        //$('.filler').hide();
        //$('#'+c.peer).show();
        //$('#send').show();
        //isStarted = true;
        var yfinger = (buddy.priv.fingerprint()).toUpperCase();
        var bfinger = (buddy.their_priv_pk.fingerprint()).toUpperCase();
        $('#yfinger').text(formatFinger(yfinger));
        $('#bfinger').text(formatFinger(bfinger));
        $('#bsend').attr("disabled", false);
        $('#bsend').css('background-color','#629007');
        $('#bsend').css('border','1px solid #588500');
        $('#bsend').css('color','#fff');
        $('#bsend').css('cursor','pointer');
        $('#auth').show();
        $('#waitotr').hide();
        isFinger = true;
        //console.log("isFinger True");
    }
}

(function () {

    var original = document.title;
    var timeout;

    window.flashTitle = function (newMsg, howManyTimes) {
        function step() {
            document.title = (document.title == original) ? newMsg : original;

            if (--howManyTimes > 0) {
                timeout = setTimeout(step, 1000);
            }
            ;
        };

        howManyTimes = parseInt(howManyTimes);

        if (isNaN(howManyTimes)) {
            howManyTimes = 5;
        }
        ;

        cancelFlashTitle(timeout);
        step();
    };

    window.cancelFlashTitle = function () {
        clearTimeout(timeout);
        document.title = original;
    };

}());


if (window.location.hash) {
    var hash = window.location.hash.substring(1);
    hash = hash.substr(0,4);

} else {
    var hash = '';
}


dTitle = $(document).find("title").text();

nMessages = 0;


var chrome, chrome1, turn;
var is_chrome = window.chrome;
if (is_chrome) {
    chrome = window.navigator.appVersion.match(/Chrom(e|ium)\/(\d+)\./)[2];
}
if (chrome) {
    chrome1 = parseInt(chrome, 10);
}
else {
    chrome1 = 0;
}
//turn = {url: 'turn:turn@46.165.240.76:3479', credential: 'server'};
//if (chrome1 >= 28) {
turn = { url: 'turn:46.165.240.76:3478', credential: 'asperTinO1', username: 'otrto' },
{ url: 'turn:108.61.211.199:3478', credential: 'asperTinO1', username: 'otrto' };
//}


var peer = new Peer('', {
            host: 'otr.to',
            port: 9000, path: '/',
            key: 'peerjs',
            debug: 0,
            secure: true,
            logFunction: function () {
                var copy = Array.prototype.slice.call(arguments).join(' ');
                $('.log').append(copy + '<br>');
            },
            config: {'iceServers': [
                {url: 'stun:46.165.240.76:3478'},
                {url: 'stun:108.61.211.199:3478'},
                turn
            ]}
        }
);

var buddy, intervalId;
var isBuddyOn = false;
var connectedPeers = 0;
var isConnected = false;
var isBuddy = false;
var isMute = false;
var isFocus = true;
var isFinger = false;
var lastPng = 0;
var firstPng = false;
var isStarted = false;
var dTitle = $(document).find("title").text();
var nMessages = 0;
var prevError = '';
var isUpOn = false;

//OTR

//var myKey = new DSA();

var start = (new Date()).getTime();


// Show this peer's ID.
peer.on('open', function (id) {
    $('#pid').text(id);
    $('#purl').text(document.URL+"/#" + id);
    $(function () {
        $("#pid").click(function () {
            SelectText("pid");
        });
    });
    $(function () {
        $("#purl").click(function () {
            SelectText("purl");
        });
    });
});

// Await connections from others
peer.on('connection', connect);

peer.on('error', function (err) {
    $('#logg').append('<font color="red"><strong>' + err + '. Type:' + err.type + '</strong></font><br>');
});


// Handle a connection object.
function connect(c) {
    $('.filler').html('<img src="loader.gif"><br> connecting...');

    // Handle a chat connection.
    var chatbox = $('<div></div>').addClass('connection').addClass('active').attr('id', c.peer);
    var header = $('<h1></h1>').html('Chat with <strong>' + c.peer + '</strong>');
    var messages = $('<div><em>Peer connected.</em></div>').addClass('messages');

    chatbox.append(header);
    chatbox.append(messages);
	 $('#actions').hide();
    $('#connections').append(chatbox);
    $('#' + c.peer).hide();
    //$('#logg').append('isBuddy:'+isBuddy+'<br>'+'isBuddyOn:'+isBuddyOn+'<br>');
    connectedPeers = 1;

    /*intervalId = setInterval(function() {
     c.send("-=pNg=-");
     if(isStarted) {
     var nowT = (new Date()).getTime() - lastPng;
     //$('#logg').append("Last Ping:" + nowT + '<br>');
     if (nowT > 32000) {
     $('#logg').append('<div><span>SYSTEM</span>: Last Ping:' + nowT  +'ms ago</div>');
     }
     }
     }, 15000);*/

    //console.log("isStarted:"+isStarted);
    if (!isStarted) {
        $('.filler').hide();
        $('#' + c.peer).show();
        $('#send').show();
        isStarted = true;
    }
    c.on('data', snobuddyOn);

    c.on('close', function () {
        clearInterval(intervalId);
        $('#text').hide();
        $('#tarea').html('<font color="red"><strong>' + c.peer + ' has left the chat.</strong></font><br>Close this window to remove all data.<br>');

        //alert(c.peer + ' has left the chat.');
        //chatbox.remove();
        //if ($('.connection').length === 0) {
        //    $('.filler').show();
        //}
        //connectedPeers = 0;
        //window.location.href = "https://otr.to/";
    });


    //setInterval(function() {
    //		$('#logg').append('messages:'+nMessages+'<br>'+'isBuddy:'+isBuddy+'<br>');
    //	}, 8000);
    //setInterval(function() {
    //		$('#logg').append('ConnectedPeers:'+connectedPeers+'<br>'+'isBuddy:'+isBuddy+'<br>'+'firstPng:'+firstPng+'<br>'+'isStarted:'+isStarted+'<br>');
    //	}, 8000);
}


$(function() {
    var tipLink,tBlock,tTitle,tipText,myTip;
    $('a.linktip').wrap('<span class="tip" />'); 
    $('span.tip').each(function(){
        myTip = $(this),
                tipLink = myTip.children('a'),
                tBlock = myTip.children('span').length, 
                tTitle = tipLink.attr('title') != 0, 
                tipText = '<div id="zone9"><p class="legend">Click here or drag here your file.<br>File will be encrypted before upload.<br>For more information check<br>"Secure File Sharing"</p></div>'; 

        tipLink.removeAttr("title"); 
        if(tBlock === 0 && tTitle === true){myTip.append('<span class="answer">' + tipText + '</span>')};

        var tip = myTip.find('span.answer , span.answer-left').hide(); 
        tipLink.click(showTip).siblings('span').append('<b class="close">X</b>');


        tip.on('click', '.close', function(){
                    isUpOn = false;
                    tip.fadeOut(200);}
        );


        function showTip(e){
            var xM = e.pageX,
            yM = e.pageY,
            tipW = tip.width(),
            tipH = tip.height(),
            winW = $(window).width(),
            winH = $(window).height(),
            scrollwinH = $(window).scrollTop(),
            scrollwinW = $(window).scrollLeft(),
            curwinH = $(window).scrollTop() + $(window).height();
            if ( xM > scrollwinW + tipW * 2 ) {tip.removeClass('answer').addClass('answer-left');}
            else {tip.removeClass('answer-left').addClass('answer');}
            if ( yM > scrollwinH + tipH && yM > curwinH / 2 ) {tip.addClass('a-top');}
            else {tip.removeClass('a-top');}
            tip.fadeIn(100).css('display','block');
            e.preventDefault();
            isUpOn = true;
            var zonehtml = $('#zone9').html();
            var options = {input: null, multiple: false};
            var zone = new FileDrop('zone9', options);
            zone.event('send', function (files) {
                $('#zone9').html('<br><img src="loader.gif">');
                files.each(function (file) {
                    file.read({
                        func: 'readAsArrayBuffer',
                        onDone: function (str) {
                            var isPass = passwordGen(12);
                            var isBurn = 1;
                            var isExpired = 86400;
                            var binary = "";
                            var bytes = new Uint8Array(str);
                            var length = bytes.byteLength;
                            for (var i = 0; i < length; i++) {
                                binary += String.fromCharCode(bytes[i]);
                            }
                            var test1 = CryptoJS1.AES.encrypt(binary, isPass);
                            var test2 = CryptoJS1.enc.Utf8.parse(test1);
                            var test3 = CryptoJS1.enc.Base64.stringify(test2);

                            $.post(
                                    "/f/s.php",
                                    {
                                        toenc: test3,
                                        burn: isBurn,
                                        isdesc: '',
                                        expired: isExpired,
                                        isfile: file.name,
                                        issize: file.size
                                    }
                            ).done(function (data) {
                                        if (data != '') {
                                            var words = CryptoJS1.enc.Utf8.parse(isPass);
                                            var base64 = CryptoJS1.enc.Base64.stringify(words);
                                            //$('#text').append(' https://otr.to/f/?' + data + '#' + base64+' ');
                                            eachActiveConnection(function (c, $c) {
                                                if (c.label === 'chat') {

                                                    //console.log("YOU OTR:" + msg);
                                                    var messageBox = $c.find('.messages');
                                                    var msg = '<a href="https://otr.to/f/?' + data + '#' + base64+'" target="_blank">' + file.name + '</a>';
                                                    c.send('?MSG:'+msg);
                                                    messageBox.append('<div><span class="you">You: </span> <i class="fa fa-paperclip fa-2x"></i>&nbsp;' + msg + '</div>');
                                                    messageBox.scrollTop(messageBox[0].scrollHeight);
                                                    isUpOn = false;
                                                    tip.fadeOut(200);
                                                }
                                            });
                                        }
                                        $('#zone9').html(zonehtml);
                                    })
                                    .error(function () {
                                        alert("error");
                                        $('#zone9').html(zonehtml);
                                    });
                        },
                        onError: function (e) { alert('Terrible error!') }
                    });
                });
            });
        };
    });
});

$(document).ready(function () {

    //var brows = util.browser;
    //$('#logg').append('Browser:'+brows+'<br>');
    if (util.supports.data) {
        //$('#logg').append('Your browser supports peeer-to-peer connection<br>');
    }
    else {
	$('#logg').append('<h3>You have to use Firefox or Chrome for this website</h3>');
        $('#logg').append('<font color="red"><strong>Error: Your browser does not support peeer-to-peer connection</strong></font><br>');
    }

    // Connect to a peer
    $('#connect').on("click", function () {
        $('.filler').html('<img src="loader.gif"><br> connecting...');
        var requestedPeer = $('#rid').val();
        if (connectedPeers == 0 && !isConnected) {
            // Create 2 connections, one labelled chat and another labelled file.
            var c = peer.connect(requestedPeer, {
                label: 'chat',
                serialization: 'none',
                reliable: false,
                metadata: {message: 'hi i want to chat with you!'}
            });
            c.on('open', function () {
                connect(c);
            });
            c.on('error', function (err) {
                        //alert(err);
                        var thisErr = err;
                        if (thisErr != prevError) {
                            $('#logg').append('<font color="red"><strong>' + err + '</strong></font><br>');
                        }
                        prevError = thisErr;
                        clearInterval(intervalId);
                    }
            );
            //buddy.sendMsg("hi i want to chat with you!");
            isConnected = true;
            connectedPeers = 1;
			$('#actions').hide();
         
        }
    });

    $('#text').keydown(function (e) {
        if (e.which == 13 && e.ctrlKey) {
            $('#text').val($('#text').val() + "\n");
            return false;
        }
        if (e.which == 13) {
            $('#send').trigger("submit");
            return false;
        }
    });

    $('#rid').keydown(function (e) {
        if (e.which == 13) {
            $('#connect').trigger("click");
            return false;
        }
    });

    // Close a connection.
    $('#close').click(function () {
        eachActiveConnection(function (c) {
            c.close();
        });
    });


    $('#send').on("submit", function (e) {
        e.preventDefault();

        // For each active connection, send the message.
        var msg = $('#text').val();
        if (isBuddy) {
            buddy.sendMsg(msg);
        }
        else {
            eachActiveConnection(function (c) {
                //console.log("YOU:"+msg);
                c.send(msg);
            });
        }
        eachActiveConnection(function (c, $c) {
            if (c.label === 'chat') {
                //$c.find('.messages').append('<div><span class="you">You: </span>' + replaceURLWithHTMLLinks(nl2br(htmlEncode(msg))) + '</div>');
                var messageBox = $c.find('.messages');
                messageBox.append('<div><span class="you">You: </span>' + replaceURLWithHTMLLinks(nl2br(htmlEncode(msg))) + '</div>');
                messageBox.scrollTop(messageBox[0].scrollHeight);
            }
        });
        $('#text').val('');
        $('#text').focus();
    });

    // Goes through each active peer and calls FN on its connections.


    // Show browser version
    $('#browsers').text(navigator.userAgent);

    if (hash) {
        $('#rid').val(hash);
        $('#connect').trigger("click");
        hash = false;
    }


    $(window).on("focus", function () {
        nMessages = 0;
        cancelFlashTitle();
        $(document).prop('title', dTitle);
        isFocus = true;
    });

    $(window).on("blur", function () {
        isFocus = false;
    });


    $('#sound').on('click', function () {
        if (!isMute) {
            isMute = true;

        }
        else {
            isMute = false;

        }
    });

    $('#otron').on('click', function () {
        //clearInterval(intervalId);
        if (!isBuddyOn) {
            $('#bsend').attr("disabled", true);
            $('#bsend').css('background-color','#a7a39f');
            $('#bsend').css('border','1px solid #000');
            $('#bsend').css('color','#000');
            $('#bsend').css('cursor','not-allowed');
            //setTimeout(function(){
            //$('#ae1').html('<img src="486.gif">');
            //},0);
            $('#waitotr').show();
            isBuddyOn = true;
            eachActiveConnection(function (c) {
                c.send('-=?OTR?=-');
                c.off('data', snobuddyOn);
            });

            if (!isBuddy) {
                //setTimeout(function () {
                buddy = new OTR(
                        {
                            fragment_size: 140, send_interval: 200, priv: new DSA(), debug: false
                        }
                );
                buddy.REQUIRE_ENCRYPTION = true;
                buddy.on('ui', function (msg, encrypted) {
                    eachActiveConnection(function (c, $c) {
                        if (c.label === 'chat') {
                            if (msg != "-=pNg=-") {
                                var subMsg = msg.substr(0, 5);
                                //console.log(subMsg);
                                if (subMsg != '?OTR:') {
                                    if (!isMute) {
                                        $('#chatAudio')[0].play();
                                    }
                                    nMessages += 1;
                                    //$c.find('.messages').append('<div><span class="peer">' + c.peer + '</span>: ' + replaceURLWithHTMLLinks(nl2br(htmlEncode(msg))) + '</div>');
                                    var messageBox = $c.find('.messages');
                                    if(subMsg != '?MSG:') msg = replaceURLWithHTMLLinks(nl2br(htmlEncode(msg)));
                                    else {
                                        msg = '<i class="fa fa-paperclip fa-2x"></i>&nbsp;'+msg.substr(5);
                                    }
                                    messageBox.append('<div><span class="peer">' + c.peer + '</span>: ' + msg + '</div>');
                                    messageBox.scrollTop(messageBox[0].scrollHeight);
                                    if (!isFocus) {
                                        flashTitle("(" + nMessages + ") " + dTitle, 100000000);
                                    }
                                    //$(document).prop('title',"("+nMessages+") "+dTitle);
                                }
                            }
                            else {
                                firstPng = true;
                                lastPng = (new Date()).getTime();
                            }
                        }
                    });
                });

                buddy.on('io', function (msg, meta) {
                    eachActiveConnection(function (c, $c) {
                        if (c.label === 'chat') {

                            //console.log("YOU OTR:" + msg);
                            c.send(msg);
                            //$c.find('.messages').append('<div><span class="you">You: </span>' + msg + '</div>');
                        }
                    });
                    //console.log("message to send to buddy: " + msg);
                    //console.log("(optional) with sendMsg attached meta data: " + meta);
                });

                buddy.on('error', function (err, severity) {
                    if (severity === 'error')  // either 'error' or 'warn'
                        console.log("error occurred: " + err);
                });

                buddy.on('status', function (state) {
                    if (state === OTR.CONST.STATUS_AKE_SUCCESS) {
                        //console.log('<br />ake took <strong>' + ((new Date()).getTime() - start) + 'ms</strong>');
                        //console.log('<br />message state is ' + (buddy.msgstate ? 'encrypted' : 'plaintext') + '</strong>');
                    }
                });
                isBuddy = true;
                intervalId = setInterval(function () {
                    buddy.sendMsg("-=pNg=-");
                    if (isStarted) {
                        var nowT = (new Date()).getTime() - lastPng;
                        //$('#logg').append("Last Ping:" + nowT + '<br>');
                        if (nowT > 16000) {
                            //  $c.find('.messages').append('<div><span class="peer">SYSTEM</span>: Last Ping:' + nowT  +'ms ago</div>');
                        }
                    }
                }, 5000);

                //console.log("isBuddy true");
                eachActiveConnection(function (c) {
                    c.on('data', sbuddyOn);
                });
                $('otron').prop('disabled', true);
                //$('#ae1').html('<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="otron" checked disabled><label class="onoffswitch-label" for="otron"><span class="onoffswitch-inner"></span><span class="onoffswitch-switch"></span></label>');
                //console.log("buddy is on");
                //}, 1000);
            }
        }
        //else {
        //    isBuddyOn = false;
        //}
    });


    $('textarea')
            .focus(function () {
                $(this).css("background", "#fff")
            })

});

// Make sure things clean up properly.

window.onunload = window.onbeforeunload = function (e) {
    if (!!peer && !peer.destroyed) {
        peer.destroy();
    }
};
