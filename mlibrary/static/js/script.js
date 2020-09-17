$(document).ready(function () {
    // var socket = io.connect( window.location.protocol + '//' + window.location.host + '/chat');
    var popupLoading = '<i class="notched circle loading icon green"></i> Loading...';
    var message_count = 0;
    var ENTER_KEY = 13;

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrf_token);
            }
        }
    });

    function scrollToBottom() {

        var $messages = $('.messages');

        if ($messages.length>0){
            $('#message-textarea').focus();

            $messages.scrollTop($messages[0].scrollHeight);
        }


    }

    var page = 1;

    function load_messages() {
        var $messages = $('.messages');
        var position = $messages.scrollTop();
        if (position === 0 && socket.nsp !== '/anonymous'&& socket.nsp !== '/privatechat'&& socket.nsp !== '/chat') {
            page++;
            $('.ui.loader').toggleClass('active');
            $.ajax({
                url: messages_url,
                type: 'GET',
                data: {page: page},
                success: function (data) {
                    var before_height = $messages[0].scrollHeight;
                    $(data).prependTo(".messages").hide().fadeIn(800);
                    var after_height = $messages[0].scrollHeight;
                    flask_moment_render_all();
                    $messages.scrollTop(after_height - before_height);
                    $('.ui.loader').toggleClass('active');
                    activateSemantics();
                },
                error: function () {
                    alert('No more messages.');
                    $('.ui.loader').toggleClass('active');
                }
            });
        }
    }

    $('.messages').scroll(load_messages);
    if (typeof socket!=="undefined"){
        socket.on('user count', function (data) {
        $('#user-count').html(data.count);
    });
    }

    if (typeof socket!=="undefined") {

        socket.on('new message', function (data) {
            if (data.isRemove===1){
                $('.msg-box-load').remove();
            }

            user_stance = data.user_stance;
            message_count++;
            if (!document.hasFocus()) {
                document.title = '(' + message_count + ') ' + 'Unread';
            }
            // if (data.user_id !== current_user_id) {
            //     messageNotify(data);
            // }
            $('.messages').append(data.message_html);
            flask_moment_render_all();
            scrollToBottom();
            activateSemantics();
        });

    }

    if (typeof socket!=="undefined") {
        socket.on('load message', function (data) {
            if(!$("#div").hasClass('msg-box-load')){
                setTimeout(function () {

                     $('.messages').append(data.load_message_html);
                        scrollToBottom();
                        activateSemantics();


                },1000);
            }



        });
    }




    if (typeof socket!=="undefined"){
        socket.on('check', function (data) {
        var quote = $('#quote').text();
        var $textarea = $('#message-textarea');
        var time_delay = 30;
        if (data.user_id === current_user_id) {


            if (data.result===1) {
                // if($("#div").hasClass('msg-box-load')){
                //     socket.emit('new message', quote+data.message_body, 1,room_id,isShow);
                //     $textarea.val('');
                //     $("#quote").text('');
                //     $('#deletequote').hide();
                //
                //     socket.emit('load message', room_id);
                // }else{
                    socket.emit('new message', quote+data.message_body, 1,room_id,isShow);
                    $textarea.val('');
                    $("#quote").text('');
                    $('#deletequote').hide();
                // }



                // socket.emit('chatbot', room_id,quote+data.message_body, isShow);



            }
            else if(data.result===0) {

                if (confirm("your message is not persuasive, are you sure to send it?")) {
                    // if($("#div").hasClass('msg-box-load')){
                    //     socket.emit('new message', quote+data.message_body, 0,room_id,isShow);
                    //     $textarea.val('');
                    //     $("#quote").text('');
                    //     $('#deletequote').hide();
                    //
                    //     socket.emit('load message', room_id);
                    // }else{
                        socket.emit('new message', quote+data.message_body, 0,room_id,isShow);
                        $textarea.val('');
                        $("#quote").text('');
                        $('#deletequote').hide();

                    // }

                // socket.emit('chatbot', room_id,quote+data.message_body, isShow);



                }
                else{

                    $.ajax({
                        type: 'POST',
                        url: "/revised_message",
                        data: {'room_id':room_id, 'message_text':quote+data.message_body},
                        success: function () {
                            // alert('Success, this user is gone!')
                        },
                        error: function () {
                            alert('Oops, something was wrong!')
                        }
                    });
                }
            }
            else{
                // if($("#div").hasClass('msg-box-load')){
                //     socket.emit('new message', quote+data.message_body, -1,room_id,0);
                //     $textarea.val('');
                //     $("#quote").text('');
                //     $('#deletequote').hide();
                //
                //     socket.emit('load message', room_id);
                // }else{
                    socket.emit('new message', quote+data.message_body, -1,room_id,0);
                    $textarea.val('');
                    $("#quote").text('');
                    $('#deletequote').hide();

                // }
                // socket.emit('chatbot', room_id,quote+data.message_body, 0);
            }
        }

                    });
    }



    function new_message(e) {
        var $textarea = $('#message-textarea');
        var message_body = $textarea.val().trim();
        var time_delay = 30;
        var quote = $('#quote').text();
        if (e.which === ENTER_KEY && !e.shiftKey && message_body) {
            e.preventDefault();
            var ans = $('input:radio[name="ans"]:checked').val();

            // var stance = user_stance;

            if(isShow==1 ){
            socket.emit('check', message_body,room_id);

            }else{

                if($("#div").hasClass('msg-box-load')){

                    socket.emit('new message', quote+message_body, -1,room_id,isShow);
                    $textarea.val('');
                    $("#quote").text('');
                    $('#deletequote').hide();
                    socket.emit('load message', room_id);
                }
                else{

                    socket.emit('new message', quote+message_body, -1,room_id,isShow);
                    $textarea.val('');
                    $("#quote").text('');
                    $('#deletequote').hide();
                }



            // socket.emit('chatbot', room_id,quote+message_body, isShow);



            }

        }
    }

    // submit message
    $('#message-textarea').on('keydown', new_message.bind(this));



    // submit snippet
    $('#snippet-button').on('click', function () {
        var $snippet_textarea = $('#snippet-textarea');
        var message = $snippet_textarea.val();
        if (message.trim() !== '') {
            socket.emit('new message', message);
            $snippet_textarea.val('')
        }
    });

    // open message modal on mobile
    $("#mobile-message-textarea").focus(function () {
        if (screen.width < 600) {
            $('#mobile-new-message-modal').modal('show');
            $('#mobile-message-textarea').focus()
        }
    });

    $('#send-button').on('click', function () {
        var $mobile_textarea = $('#mobile-message-textarea');
        // var quote = $('#quote');
        var message = $mobile_textarea.val();
        if (message.trim() !== '') {
            socket.emit('new message', message);
            $mobile_textarea.val('')
        }
    });

    // quote message
    $('body').delegate('.quote-button','click', function () {
        // $('#quote').show();
        $('#deletequote').show();

        var $textarea = $('#message-textarea');
        var message = $(this).parent().parent().parent().find('.message-body').text();
        var name = $(this).parent().parent().parent().find('.nickname').text();
        $("#quote").text('>' + name+': '+message+ '\n\n');
        $(".messages").css("paddingBottom",$("#quote").height());
        scrollToBottom();
        // $(".messages").paddingBottom += $("#quote").height();
        // $textarea.val('> ' + name+'\n'+message + '\n\n');
        $textarea.val($textarea.val()).focus()

    });
    $('#deletequote').click(function () {

                $('#quote').text('');
                $('#deletequote').hide();
                $(".messages").css("paddingBottom","10px");
        scrollToBottom();



            });


    $('body').delegate('#mydiv','click', function () {
    // $("#mydiv").on('click',function () {


        var ans = $('input:radio[name="ans"]:checked').val();
        var a='';
        if(ans==0){
            a='legal';
        }else{
            a='illegal'
        }

        if(ans==null){
            alert('please choose your stance first');
        }else{

            $("#answer").removeAttr('hidden');
            $("#answer").text('your answer is:'+a+ '\n\n');
            $("#mydiv").remove();
            var mid=$("#mid").text();
            socket.emit('update_message', 'Do you think gay marriage is legal or illegal?\n\n>your answer is:'+a+ '\n\n', mid,ans,room_id);
            user_stance = ans;


        }

      });

    function messageNotify(data) {
        if (Notification.permission !== "granted")
            Notification.requestPermission();
        else {
            var notification = new Notification("Message from " + data.nickname, {
                icon: data.gravatar,
                body: data.message_body.replace(/(<([^>]+)>)/ig, "")
            });

            notification.onclick = function () {
                window.open(root_url);
            };
            setTimeout(function () {
                notification.close()
            }, 4000);
        }
    }

    function activateSemantics() {
        $('.ui.dropdown').dropdown();
        $('.ui.checkbox').checkbox();

        $('.message .close').on('click', function () {
            $(this).closest('.message').transition('fade');
        });

        $('#toggle-sidebar').on('click', function () {
            $('.menu.sidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
        });

        $('#show-help-modal').on('click', function () {
            $('.ui.modal.help').modal({blurring: true}).modal('show');
        });


        $('#show-snippet-modal').on('click', function () {
            $('.ui.modal.snippet').modal({blurring: true}).modal('show');
        });

        $('.pop-card').popup({
            inline: true,
            on: 'hover',
            hoverable: true,
            html: popupLoading,
            delay: {
                show: 200,
                hide: 200
            },
            onShow: function () {
                var popup = this;
                popup.html(popupLoading);
                $.get({
                    url: $(popup).prev().data('href')
                }).done(function (data) {
                    popup.html(data);
                }).fail(function () {
                    popup.html('Failed to load profile.');
                });
            }
        });
    }

    function init() {
        // desktop notification
        document.addEventListener('DOMContentLoaded', function () {
            if (!Notification) {
                alert('Desktop notifications not available in your browser.');
                return;
            }

            if (Notification.permission !== "granted")
                Notification.requestPermission();
        });

        $(window).focus(function () {
            message_count = 0;
            document.title = 'mlibrary';
        });

        activateSemantics();
        scrollToBottom();
    }

    // delete message
    $('body').delegate('.delete-button','click', function () {
        var $this = $(this);
        $.ajax({
            type: 'DELETE',
            url: $this.data('href'),
            success: function () {
                $this.parent().parent().parent().remove();
            },
            error: function () {
                alert('Oops, something was wrong!')
            }
        });
    });

    // delete user
    $(document).on('click', '.delete-user-button', function () {
        var $this = $(this);
        $.ajax({
            type: 'DELETE',
            url: $this.data('href'),
            success: function () {
                alert('Success, this user is gone!')
            },
            error: function () {
                alert('Oops, something was wrong!')
            }
        });
    });

    $('#joinroomtable').on('click', ":button",function () {

    index = $(this).closest("tr").find("td").eq(0).text();
    $(this).parents("tr").remove();




    $.ajax({
    url: "/joinroom",
    type:"post",
    data: {'name': index},
    success: function(response, textStatus, fn) {
      // document.getElementById("feedbackfeedback").innerHTML=data;
      // $("#progressBar").attr('hidden', 'true');
      // $("#compareSubmit").removeAttr('hidden');
      // if (response['error'] != "") {
      //   $("#errorMessage").text(response['error']);
      //   $("#errorMessage").removeAttr('hidden');
        var data = response['data'];
            var tr = "<tr>"+
                "<td>"+data.name+ "</td>"+
                "<td>"+data.description+"</td>" +
                "<td>"+data.time+"</td>"+
                "<td>"+data.owner+"</td>"+
                "<td>2</td>" +
                "<td>"+data.isShow+"</td>"+
                "<td>Wait</td>"+
                "</tr>";
            if("#userwaitroom:waitnoroom".length>0){
                $("#waitnoroom").remove();
            }
			$("#userwaitroom").append(tr);
			alert(response['message']);
        $('#joinroommodal').modal('hide');


      },
      error: function () {
                alert('Oops, something was wrong!')
            }
    });
  });

    $('#createsong').on('click',function () {

        var name =$("#name").val();
        var artist=$("#artist").val();

        // // var session = $('input:radio[name="session"]:checked').val();
        // var artist=$("#select option:selected").val();
        // var description = $("#room-description").val();
        // var showpersuasive = $('input:radio[name="category"]:checked').val();
        if(name==null ||  artist==null){
            alert('please complete all the fields');


        }else{
        var data= {

                    'name': name,"artist":artist
            };



        $.ajax({
        url: "createsong",
        type:"post",
        data: data,
        success: function(response, textStatus, fn) {
          // document.getElementById("feedbackfeedback").innerHTML=data;
          // $("#progressBar").attr('hidden', 'true');
          // $("#compareSubmit").removeAttr('hidden');


          if (response['result']) {

            // alert(response['message']);

            $('#createsongmodal').modal('hide');
            var data = response['data'];
            var tr = "<tr>"+
                "<td>"+data.name+ "</td>"+
                "<td>"+data.artist+"</td>" +
                "<td>"+data.time+"</td>"+
                "<td><div class=\"item delete-song-button\"" +
                "                         data-href="+data.deleteurl+"><i class=\"delete icon\"></i></div></td>" +

                "</tr>";
            if("#userlibrary:createnosong".length>0){
                            $("#createnosong").remove();
                        }
			$("#userlibrary").append(tr);


          }
            else{
                alert(response['message'])
            }
        },
          error: function () {
                    alert('Oops, something was wrong!')
                }
        });
        }

      });

    $('#userlibrary').on('click','.delete-song-button', function () {

        var $this = $(this);
        if (confirm('Are you sure?')){
            $(this).parents("tr").remove();
            $.ajax({
            type: 'DELETE',
            url: $this.data('href'),
            success: function () {


            },
            error: function () {
                alert('Oops, something was wrong!')
            }
        });
        }



    });


    // $('#approve').on('click',function () {
    $('#approvetable').on('click','.control-approve', function () {
        var status = $('input:radio[name="category"]:checked').val();
        var email =$(this).closest("tr").find("td").eq(1).text();
        var roomname = $(this).closest("tr").find("td").eq(2).text();
        $(this).parents("tr").remove();
        $.ajax({
        url: "/validate",
        type:"post",
        data: {'email':email,'roomname':roomname,'status':status},
        success: function(response, textStatus, fn) {

          // $("#progressBar").attr('hidden', 'true');
          // $("#compareSubmit").removeAttr('hidden');

        },
          error: function () {
                    alert('Oops, something was wrong!')
                }
        });
      });

    // $('#deny').on('click',function () {
    $('#approvetable').on('click','.control-deny', function () {
        var status = $('input:radio[name="category"]:checked').val();
        var email =$(this).closest("tr").find("td").eq(1).text();
        var roomname = $(this).closest("tr").find("td").eq(2).text();
        $(this).parents("tr").remove();
        $.ajax({
        url: "/validate",
        type:"post",
        data: {'email':email,'roomname':roomname,'status':status},

        success: function(response, textStatus, fn) {


        },
          error: function () {
                    alert('Oops, something was wrong!')
                }
        });
      });

    if (typeof socket!=="undefined" && (socket.nsp === '/privatechat' || socket.nsp === '/chat')){
        socket.on('connect', function() {

            $('#message-textarea').focus();
            if (room_id.length>0){
                var time_delay = 1;
                if(!$("#div").hasClass('msg-box-load')){
                     socket.emit('load message', room_id);
                   }

                socket.emit('joined', room_id);

            }});
    }




    init();

    // // document.getElementById("keydown").addEventListener("keydown", function (event) {
    //     $('#keydown').on('keydown', function(event){
    //     if ((event.altKey)&&
    //     ((event.code===37)|| //屏蔽 Alt+ 方向键 ←
    //     (event.code===39))){ //屏蔽 Alt+ 方向键 →
    //     alert("不准你使用ALT+方向键前进或后退网页！");
    //     event.returnValue=false;
    //     }
    //     if (event.code===116){ //屏蔽 F5 刷新键
    //         alert("禁止F5刷新网页！");
    //         event.code=0;
    //         event.returnValue=false;
    //     }
    //     if ((event.ctrlKey)&&(event.code===82)){ //屏蔽 Ctrl+R
    //         alert("禁止Ctrl+R刷新网页！");
    //         event.returnValue=false;
    //     }
    //     if ((event.shiftKey)&&(event.code===121)){ //屏蔽 shift+F10
    //         alert("禁止shift+F10刷新网页！");
    //         event.returnValue=false;
    //     }
    // });



});

function sortTable1() {

  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("tablel1");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function sortTable2() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("table1");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[0];
      y = rows[i + 1].getElementsByTagName("TD")[0];
      //check if the two rows should switch place:
      if (Number(x.innerHTML) > Number(y.innerHTML)) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function sortTable3() {

  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("table2");

  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;

    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {

      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];

      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function sortTable4() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("table2");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[0];
      y = rows[i + 1].getElementsByTagName("TD")[0];
      //check if the two rows should switch place:
      if (Number(x.innerHTML) > Number(y.innerHTML)) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}
