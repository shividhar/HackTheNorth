if (Meteor.isClient) {
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
      var beatsPerMinute = $("#BPM").val();
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
          url = 'https://raw.githubusercontent.com/shividhar/HackTheNorth/add/ui/click.mp3?token=AGU6HNlCincfqCifFtpfqQkTBS_D_4C3ks5WB1-9wA%3D%3D';

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
                      setTimeout(foo, (1000 / (beatsPerMinute / 60)));
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

    //create a web audio context in your application
var audioContext = new AudioContext();
var myWebAudioNode = audioContext.createGain();

//to access the microphone, pass the audio context and your callbacks functions
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
    },
    onAudioData: function(audioData){
        var absSum = 0;
        for (var i = 0; i < audioData.length; ++i) {
          absSum += Math.abs(audioData[i]);
        }
        var absMean = absSum / audioData.length;
        if (absMean > 0.25) {
          var elt = document.getElementById("example_block");
          var currentLeft = elt.style.left;
          var leftText = (currentLeft.substring(0, 3));
          var finalLeft = parseInt(leftText);
          //console.log(finalLeft);
          if (finalLeft >= 450 && finalLeft <= 540) {
            ++score;
            document.getElementById("score").innerHTML = "Score : " + score;
          }
          //console.log(absMean);
        }
    }
});

  

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
}