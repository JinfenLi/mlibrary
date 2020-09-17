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



    function activateSemantics() {
        $('.ui.dropdown').dropdown();
        $('.ui.checkbox').checkbox();


        $('#toggle-sidebar').on('click', function () {
            $('.menu.sidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
        });

        $('#show-help-modal').on('click', function () {
            $('.ui.modal.help').modal({blurring: true}).modal('show');
        });


        $('#show-snippet-modal').on('click', function () {
            $('.ui.modal.snippet').modal({blurring: true}).modal('show');
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

    }




    $('#createsong').on('click',function () {

        var name =$("#name").val();
        var artist=$("#artist").val();

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







    init();



});

