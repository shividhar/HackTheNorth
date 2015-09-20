if (Meteor.isClient) {
    function gotStream(stream) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        var audioContext = new AudioContext();

        // Create an AudioNode from the stream.
        var mediaStreamSource = audioContext.createMediaStreamSource( stream );
        // instantiate new meyda with buffer size of 512 (default is 256)

        var meyda = new Meyda({
          "audioContext":audioContext,
          "source":mediaStreamSource,
          "bufferSize":4096
        });
        setInterval(function(){
         meyda.get(["rms", "energy"]);
        },50);
    }

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    navigator.getUserMedia( {audio:true}, gotStream, function(e){
      if(err) alert(err)
    });


    // window.source = context.createMediaElementSource(tune);
  
  // counter starts at 0
  Session.setDefault('counter', 0);


  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click #startMetronome': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
