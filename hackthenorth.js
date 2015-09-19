if (Meteor.isClient) {
  //create a web audio context in your application
  var audioContext = new AudioContext();
  var myWebAudioNode = audioContext.createGain();

  var microphone = new Microphone({
    audioContext: audioContext,
    onSuccess: function() {
        //connect the microphone to the rest of your web audio chain (microphone includes intermediate ScriptProcessorNode for onNoSignal and onAudioData handler)
        microphone.connect(myWebAudioNode);
        myWebAudioNode.connect(audioContext.destination);

        // instead you can also connect directly to its sourceNode, if you don't need onAudioData and onNoSignal handler methods
        // microphone.sourceNode.connect(myWebAudioNode);

        console.log("Mic access successfull!");
    },
    onReject: function() {
        console.error("Mic access rejected");
    },
    onNoSignal: function(){
        console.error("No signal received so far, check your systems settings!");
    },
    onNoSource: function(){
        console.error("No getUserMedia and no Flash available in this browser!");
    }
});
  console.log(microphone)
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.onCreated(function(){
    Session.set('metronomeRunning', false);
    Session.set("metronomeHasBeenSetOnce", false)
  })

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });
  var soundSource;

  Template.hello.events({
    'click #startMetronome': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
      if(!Session.get("metronomeRunning")){
      // Session.set("beatsPerMinute", ($("#BPM").val() / 60));
      var beatsPerMinute = $("#BPM").val() / 60;
      Session.set("metronomeRunning", true)
        // var context = new AudioContext(); // Create audio container
        // oscillator = context.createOscillator(); // Create sound source
        
        // oscillator.connect(context.destination); // Connect sound to speakers
        // oscillator.start(); // Generate sound instantly
        // oscillator.loop = true;
        // Start off by initializing a new context.
        // Keep track of all loaded buffers.

        var context, 
          soundBuffer,
          metronomeInterval,
          url = 'https://raw.githubusercontent.com/shividhar/HackTheNorth/master/public/sounds/Snare.wav?token=ACafwzgfKo5LmzxlGHXLpiCxOtRRMuVxks5WBmKrwA%3D%3D';

        // Step 1 - Initialise the Audio Context
        // There can be only one!
        function init() {
            if (typeof AudioContext !== "undefined") {
                context = new AudioContext();
            } else if (typeof webkitAudioContext !== "undefined") {
                context = new webkitAudioContext();
            } else {
                throw new Error('AudioContext not supported. :(');
            }
        }

        // Step 2: Load our Sound using XHR
        function startSound() {
            // Note: this loads asynchronously
            var request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "arraybuffer";

            // Our asynchronous callback
            request.onload = function() {
                var audioData = request.response;

                (function foo() {
                    if(Session.get("metronomeRunning")){
                      audioGraph(audioData);
                      setTimeout(foo, (beatsPerMinute * 1000));
                    }else{
                      clearInterval(metronomeInterval)
                    }
                })();
            };

            request.send();
        }



        // This is the code we are interested in
        function audioGraph(audioData, time) {
            // create a sound source
            soundSource = context.createBufferSource();

            // The Audio Context handles creating source buffers from raw binary
            context.decodeAudioData(audioData, function(soundBuffer){
                // Add the buffered data to our object
                soundSource.buffer = soundBuffer;
                // Plug the cable from one thing to the other
                soundSource.connect(context.destination);
                
                // Finally
                soundSource.start()
            }); 
        }

        init();
        startSound()
      }else{
        clearInterval(metronomeInterval);
        soundSource.stop()

      }
    },
    'click #stopMetronome': function(){
      soundSource.stop();
      soundSource = undefined;
      Session.set("metronomeRunning", false)
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
