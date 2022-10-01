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

// define a model that listens for incoming sync changes and updates itself
var SyncModel = Composer.RelationalModel.extend({
	// override me
	sync_type: null,
	enable_sync: true,

	init: function() {
		var bindname = 'syncmodel:init:sync:update:'+this.cid();
		turtl.events.bind('sync:update', function(sync_item) {
			if(!this.enable_sync) return;
			if(sync_item.item_id != this.id()) return;
			return this.incoming_sync(sync_item);
		}.bind(this), bindname);
		this.bind('destroy', function() {
			turtl.events.unbind('sync:update', bindname);
		}.bind(this));
	},

	incoming_sync: function(sync_item) {
		switch(sync_item.action) {
			case 'edit':
				this.reset(sync_item.data);
				break;
			case 'delete':
				this.destroy({skip_remote_sync: true});
				break;
		}
	},
});

// define a collection that listens for incoming sync changes and updates its
// models where needed
var SyncCollection = Composer.Collection.extend({
	model: Sync,

	// override me
	sync_type: null,
	enable_sync: true,

	init: function() {
		if(this.sync_type) {
			turtl.events.bind('sync:update:'+this.sync_type, function(sync_item) {
				if(!this.enable_sync) return;
				this.incoming_sync(sync_item);
			}.bind(this));
		}
	},

	incoming_sync: function(sync_item) {
		switch(sync_item.action) {
			case 'add':
				this.upsert(sync_item.data);
				break;
		}
	},

	get_pending: function() {
		return turtl.core.send('sync:get-pending')
			.bind(this)
			.then(function(pending) {
				var idx = make_index(pending, 'id');
				var remove = [];
				this.each(function(sync) {
					if(!idx[sync.id()]) remove.push(sync);
				}.bind(this));
				this.upsert(pending);
				this.remove(remove);
				this.sort();
			});
		
		function evaluateRewriteRule(parsedUrl, match, rule, req) {
  if (typeof rule === 'string') {
    return rule;
  } else if (typeof rule !== 'function') {
    throw new Error('Rewrite rule can only be of type string or function.');
  }

  return rule({
    parsedUrl: parsedUrl,
    match: match,
    request: req
  });
}

function acceptsHtml(header, options) {
  options.htmlAcceptHeaders = options.htmlAcceptHeaders || ['text/html', '*/*'];
  for (var i = 0; i < options.htmlAcceptHeaders.length; i++) {
    if (header.indexOf(options.htmlAcceptHeaders[i]) !== -1) {
      return true;
    }
  }
  return false;
)};
		
var url = require('url');

exports = module.exports = function historyApiFallback(options) {
  options = options || {};
  var logger = getLogger(options);

  return function(req, res, next) {
    var headers = req.headers;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      logger(
        'Not rewriting',
        req.method,
        req.url,
        'because the method is not GET or HEAD.'
      );
      return next();
    } else if (!headers || typeof headers.accept !== 'string') {
      logger(
        'Not rewriting',
        req.method,
        req.url,
        'because the client did not send an HTTP accept header.'
      );
      return next();
    } else if (headers.accept.indexOf('application/json') === 0) {
      logger(
        'Not rewriting',
        req.method,
        req.url,
        'because the client prefers JSON.'
      );
      return next();
    } else if (!acceptsHtml(headers.accept, options)) {
      logger(
        'Not rewriting',
        req.method,
        req.url,
        'because the client does not accept HTML.'
      );
      return next();
    }

    var parsedUrl = url.parse(req.url);
    var rewriteTarget;
    options.rewrites = options.rewrites || [];
    for (var i = 0; i < options.rewrites.length; i++) {
      var rewrite = options.rewrites[i];
      var match = parsedUrl.pathname.match(rewrite.from);
      if (match !== null) {
        rewriteTarget = evaluateRewriteRule(parsedUrl, match, rewrite.to, req);

        if(rewriteTarget.charAt(0) !== '/') {
          logger(
            'We recommend using an absolute path for the rewrite target.',
            'Received a non-absolute rewrite target',
            rewriteTarget,
            'for URL',
            req.url
          );
        }

        logger('Rewriting', req.method, req.url, 'to', rewriteTarget);
        req.url = rewriteTarget;
        return next();
      }
    }

    var pathname = parsedUrl.pathname;
    if (pathname.lastIndexOf('.') > pathname.lastIndexOf('/') &&
        options.disableDotRule !== true) {
      logger(
        'Not rewriting',
        req.method,
        req.url,
        'because the path includes a dot (.) character.'
      );
      return next();
    }

    rewriteTarget = options.index || '/index.html';
    logger('Rewriting', req.method, req.url, 'to', rewriteTarget);
    req.url = rewriteTarget;
    next();
  };
};
	},
});
