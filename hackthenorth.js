if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
      
      // var context = new AudioContext(); // Create audio container
      // oscillator = context.createOscillator(); // Create sound source
      
      // oscillator.connect(context.destination); // Connect sound to speakers
      // oscillator.start(); // Generate sound instantly
      // oscillator.loop = true;
      // Start off by initializing a new context.
      // Keep track of all loaded buffers.

      var context, 
        soundSource, 
        soundBuffer,
        url = 'http://thingsinjars.com/lab/web-audio-tutorial/hello.mp3';

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
              console.log(request)
              audioGraph(audioData);


          };

          request.send();
      }

      // Finally: tell the source when to start
      function playSound() {
          // play the source now
          soundSource.start(context.currentTime);
      }

      function stopSound() {
          // stop the source now
          soundSource.stop(context.currentTime);
      }



      // This is the code we are interested in
      function audioGraph(audioData) {
          // create a sound source
          soundSource = context.createBufferSource();

          // The Audio Context handles creating source buffers from raw binary
          context.decodeAudioData(audioData, function(soundBuffer){
              // Add the buffered data to our object
              soundSource.buffer = soundBuffer;
      
              // Plug the cable from one thing to the other
              soundSource.connect(context.destination);
      
              // Finally
              playSound(soundSource);
          }); 
      }

      init();
      startSound()
      for (var bar = 0; bar < 2; bar++) {
        var time = startTime + bar * 8 * eighthNoteTime;
        // Play the bass (kick) drum on beats 1, 5
        playSound(kick, time);
        playSound(kick, time + 4 * eighthNoteTime);

        // Play the snare drum on beats 3, 7
        playSound(snare, time + 2 * eighthNoteTime);
        playSound(snare, time + 6 * eighthNoteTime);

        // Play the hihat every eighth note.
        for (var i = 0; i < 8; ++i) {
          playSound(hihat, time + i * eighthNoteTime);
        }
      }

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
        //microphone.sourceNode.connect(myWebAudioNode);

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
      
          var audioSum = 0;
          for (var i = 0; i < audioData.length; i++) {
            audioSum += Math.abs(audioData[i]);
          }
          var audioMean = audioSum / audioData.length;

          

          if (audioMean > 0.25) {
            console.log(audioMean);
          }
    }
});
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
