if(Meteor.isServer){
	Meteor.startup(function(){
		Meyda = Meteor.npmRequire("meyda");
	})
}