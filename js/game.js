function getRandInt(left_bound, right_bound) {
	return Math.ceil((Math.random() * (right_bound - left_bound)) + left_bound);
}

function Player() {
	//Player constructor
	this.strength = 5;
	this.dexterity = 5;
	this.health = 5;
	this.freePoints = 0;
	
	this.strengthDecButton = document.querySelector(".characters__player__settings__strength__dec");
	this.strengthField 	   = document.querySelector(".characters__player__settings__strength__points");
	this.strengthIncButton = document.querySelector(".characters__player__settings__strength__inc");
	
	this.dexterityDecButton = document.querySelector(".characters__player__settings__dexterity__dec");
	this.dexterityField	    = document.querySelector(".characters__player__settings__dexterity__points");
	this.dexterityIncButton = document.querySelector(".characters__player__settings__dexterity__inc");
	
	this.healthDecButton = document.querySelector(".characters__player__settings__health__dec");
	this.healthField	 = document.querySelector(".characters__player__settings__health__points");
	this.healthIncButton = document.querySelector(".characters__player__settings__health__inc");
	
	this.freePointsField = document.querySelector(".characters__player__free-points");
	
	this.incValue = function(parameter) {
		if ( this.parameter ) {
			if ( parameter < 15 && this.freePoints > 0 ) {
				this.freePoints--;
				return parameter + 1;
			} else {
				return parameter;
			}
		}
	}
	
	this.decValue = function(parameter) {
		if ( parameter > 0 && this.freePoints < 15 ) {
			this.freePoints++;
			return parameter - 1;
		} else {
			return parameter;
		}
	}
}

function Enemy() {
	//Enemy constructor. Magic numbers below are used for
	//zero values prevention
	
	var points = 15;
	
	this.health = getRandInt(1, points - 3);
	points -= this.health;
	
	this.dexterity = getRandInt(1, points - 2);
	points -= this.dexterity;
	
	this.strength = points;
	points -= this.strength;
	
	this.strengthField 	= document.querySelector(".characters__enemy__settings__strength__points");
	this.dexterityField = document.querySelector(".characters__enemy__settings__dexterity__points");
	this.healthField 	= document.querySelector(".characters__enemy__settings__health__points");
}

function GameField(player, enemy) {
	//Game Field constructor. Use for manipulate
	//game field values like player's health,
	//strength, etc.
	
	this.putCharacterToField = function(character) {
		character.strengthField.value  = character.strength;
		character.dexterityField.value = character.dexterity;
		character.healthField.value    = character.health;
		if ( character.freePointsField ) {
			character.freePointsField.value = character.freePoints;
		}
	}
	
	
	
	this.addEventsForParameters = function() {
		this.updatePlayerFields = function() {
			player.strengthField.value = player.strength;
			player.dexterityField.value = player.dexterity;
			player.healthField.value = player.health;
			player.freePointsField.value = player.freePoints;
		}
		
		player.strengthDecButton.onclick = function() {
			player.strength = player.decValue(player.strength);
		}
		
		player.strengthIncButton.onclick = function() {
			player.strength = player.incValue(player.strength);
		}
	}
	
	this.putCharacterToField(player);
	this.putCharacterToField(enemy);
	
	this.addEventsForParameters();
	
}




var player = new Player();
var enemy  = new Enemy();

var gameField = new GameField(player, enemy);
