"use strict";
var Sync = Composer.Model.extend({
	start: function() {
		return turtl.core.send('sync:start');
	},

	pause: function() {
		return turtl.core.send('sync:pause');
	},

	resume: function() {
		return turtl.core.send('sync:resume');
	},

	status: function() {
		return turtl.core.send('sync:status');
	},

	shutdown: function(wait) {
		return turtl.core.send('sync:shutdown', wait);
	},

	unfreeze: function() {
		return turtl.core.send('sync:unfreeze-item', this.id());
	},

	delete: function() {
		return turtl.core.send('sync:delete-item', this.id());
	},
});
