function getRandInt(left_bound, right_bound) {
	// Returns random int between left_bound and right_bound
	return Math.ceil((Math.random() * (right_bound - left_bound)) + left_bound);
}

function Character () {
	// Character object prototype. The player and the enemy
	// are inherited of Character.
	this._strength   = 5;
	this._dexterity  = 5;
	this._health     = 5;
	this._max_points = 15;
	
	this.hitOpponent = function (character) {
		// Hits the opponent. Virtually.
		character.reportHitReceived(this);
	}
	
	this.reportHitReceived = function (character) {
		// Handles the received hit and counts the damage.+
		if ( getRandInt(0, character._dexterity) > getRandInt(0, this._dexterity) ) {
			if ( this._health >= character._strength ) {
				this._health -= character._strength;
			} else {
				this._health = 0;
			}
	}
	
	this.renewFields = function () {
		// Updates the fields' values after them being modified
		// by user.
		this.strengthField.value  = this._strength;
		this.dexterityField.value = this._dexterity;
		this.healthField.value    = this._health;
	}
}

function Player () {
	// Player object prototype. The player is you.
	Character.apply(this, arguments);
	
	var self = this;
	
	this._freePoints = 0;
	
	this.strengthDecButton  = document.querySelector(".characters__player__settings__strength__dec");
	this.strengthField      = document.querySelector(".characters__player__settings__strength__points");
	this.strengthIncButton  = document.querySelector(".characters__player__settings__strength__inc");
	
	this.dexterityDecButton = document.querySelector(".characters__player__settings__dexterity__dec");
	this.dexterityField     = document.querySelector(".characters__player__settings__dexterity__points");
	this.dexterityIncButton = document.querySelector(".characters__player__settings__dexterity__inc");
	
	this.healthDecButton    = document.querySelector(".characters__player__settings__health__dec");
	this.healthField        = document.querySelector(".characters__player__settings__health__points");
	this.healthIncButton    = document.querySelector(".characters__player__settings__health__inc");
	
	this.freePointsField    = document.querySelector(".characters__player__free-points");
	
	this._oldRenewFields = this.renewFields;
	this.renewFields = function () {
		// Does the same thing as its prototype but renews the free points value.
		this._oldRenewFields();
		this.freePointsField.value = this._freePoints;
	}
	
	this.decStrength = function () {
		if ( self._strength > 1 && self._freePoints < self._max_points ) {
			self._strength--;
			self._freePoints++;
			self.renewFields();
		}
	}
	this.strengthDecButton.onclick = this.decStrength;
	
	this.incStrength = function () {
		if ( self._strength < self._max_points && self._freePoints > 0 ) {
			self._strength++;
			self._freePoints--;
			self.renewFields();
		}
	}
	this.strengthIncButton.onclick = this.incStrength;
	
	this.decDexterity = function () {
		if ( self._dexterity > 1 && self._freePoints < self._max_points ) {
			self._dexterity--;
			self._freePoints++;
			self.renewFields();
		}
	}
	this.dexterityDecButton.onclick = this.decDexterity;
	
	this.incDexterity = function () {
		if ( self._dexterity < self._max_points && self._freePoints > 0 ) {
			self._dexterity++;
			self._freePoints--;
			self.renewFields();
		}
	}
	this.dexterityIncButton.onclick = this.incDexterity;
	
	this.decHealth = function () {
		if ( self._health > 1 && self._freePoints < self._max_points ) {
			self._health--;
			self._freePoints++;
			self.renewFields();
		}
	}
	this.healthDecButton.onclick = this.decHealth;
	
	this.incHealth = function () {
		if ( self._health < self._max_points && self._freePoints > 0 ) {
			self._health++;
			self._freePoints--;
			self.renewFields();
		}
	}
	this.healthIncButton.onclick = this.incHealth;
	
	this.renewFields();
}

function Enemy () {
	// Enemy object prototype.
	Character.apply(this, arguments);
	
	this.strengthField  = document.querySelector(".characters__enemy__settings__strength__points");
	this.dexterityField = document.querySelector(".characters__enemy__settings__dexterity__points");
	this.healthField    = document.querySelector(".characters__enemy__settings__health__points");
	
	// The construction below spreads 15 points to make
	// an enemy with "random" stats.
	var _points = 15;
	this._health = getRandInt(1, _points - 3);
	_points -= this._health;
	this._dexterity = getRandInt(1, _points - 2);
	_points -= this._dexterity;
	this._strength = _points;
	_points -= this._strength;
	
	this.renewFields();
}

function Judge (player, enemy) {
	// The judge object prototype. The judge here is the one
	// who starts the battle, watch it's results and writes it to
	// the battle console.
	var battleLog = document.querySelector(".game-field__console");
	
	var self = this;
	
	this.isDamageMade = function ( oldHealth, actualHealth ) {
		if ( (oldHealth - actualHealth) > 0 ) {
			return true;
		} else {
			return false;
		}
	}
	
	this.makeBattle = function* ( isPlayerAttacks = true ) {
		// The battle generator. It is made for you to iterate
		// through the battle.
		// The generator here makes things more complex. But the
		// task says that the hits should be made with one second
		// delay, so the combination of timer and generator looks
		// like perfect solution for that.
		var _oldPlayerHealth = 0;
		var _oldEnemyHealth = 0;
		while ( player._health > 0 && enemy._health > 0 ) {
			if ( isPlayerAttacks ) {
				isPlayerAttacks = false;
				_oldEnemyHealth = enemy._health;
				player.hitOpponent(enemy);
				if ( this.isDamageMade(_oldEnemyHealth, enemy._health) ) {
					yield "You hit the monster with " + (_oldEnemyHealth - enemy._health) + " damage.\n";
				} else {
					yield "Your attack has been deflected.\n";
				}
			} else {
				isPlayerAttacks = true;
				_oldPlayerHealth = player._health;
				enemy.hitOpponent(player);
				if ( this.isDamageMade(_oldPlayerHealth, player._health) ) {
					yield "The monster hit you with " + (_oldPlayerHealth - player._health) + " damage.\n";
				} else {
					yield "You have deflected the monster's attack.\n";
				}
			}
		}
		if ( player._health === 0 && enemy._health === 0 ) {
			return "Draw!\n";
		} else {
			if ( player._health === 0 ) {
				return "Monster wins!\n";
			} else {
				return "You win!\n";
			}
		}
	}
	
	var battle = this.makeBattle(player, enemy);
	
	this.startBattle = function () {
		// Call it to start the battle.
		var self = this;
		var attackCount = 1;
		// The interval stuff is not so clean and I know that.
		this.interval = setInterval(function () {
			var currentHit = battle.next();
			battleLog.value = attackCount + " " + currentHit["value"] + battleLog.value + "\n";
			attackCount++;
			if ( attackCount % 2 !== 0 ) {
				battleLog.value = "\n" + battleLog.value;
			}
			if ( currentHit["done"] ) {
				clearInterval(self.interval);
			}
		}, 1000);
		return this.interval;
	}
	
	this.watchStartButton = function () {
		// When the user hit the start button, the controls
		// should be disabled and the battle should be started.
		var startButton = document.querySelector(".game-field__fight-button");
		
		startButton.onclick = function () {
			if ( player._freePoints === 0 ) {
				startButton.disabled = true;
				player.strengthDecButton.disabled = true;
				player.strengthIncButton.disabled = true;
				player.dexterityDecButton.disabled = true;
				player.dexterityIncButton.disabled = true;
				player.healthDecButton.disabled = true;
				player.healthIncButton.disabled = true;
				self.startBattle();	
			}
		}
	}	
}


var player = new Player();
var enemy = new Enemy();
var judge = new Judge(player, enemy);
judge.watchStartButton();
