angular.module('BlockUI', []).provider("$blockUI", function() {
  var defaults;
  defaults = {
    innerHTML: 'Loading ...',
    blockUIClass: "blockui-blocked"
  };
  this.$get = [
    "$document", function($document) {
      var BlockUI, body, createElement;
      body = $document.find('body');
      createElement = function(className) {
        return angular.element("<div>").addClass(className);
      };
      BlockUI = function(opts) {
        var backdropCss, messageBoxCss, options;
        options = this.options = angular.extend({}, defaults, opts);
        // console.log("blockuiservice::constructor() - options:", options);
        if (options.backdropClass != null) {
          this.backdropEl = createElement(options.backdropClass);
        } else {
          backdropCss = {
            'z-index': 10001,
            border: 'none',
            margin: 0,
            padding: 0,
            width: '100%',
            height: '100%',
            top: 0,
            leff: 0,
            'background-color': '#000000',
            opacity: 0.5,
            cursor: 'wait',
            position: 'fixed'
          };
          this.backdropEl = angular.element('<div>').css(backdropCss);
        }
        if (options.messageClass != null) {
          this.messageEl = createElement(options.messageClass);
        } else {
          this.messageBoxCss = {
            'z-index': 10002,
            position: 'fixed',
            'text-align': 'center',
            width: '20%',
            top: '40%',
            left: '40%',
            border: 'none',
            padding: '15px',
            backgroundColor: '#ffffff',
            '-webkit-border-radius': '5px',
            '-moz-border-radius': '5px',
            'border-radius': '5px',
            opacity: 1.0,
            color: '#000000'
          };
          this.messageEl = angular.element('<div>').css(this.messageBoxCss).html(options.innerHTML);
        }
      };
      BlockUI.prototype.isBlocked = function() {
        return this._blocked;
      };
      BlockUI.prototype.blockUI = function() {
        var self;
        if (!!this._blocked) {
          return;
        }
        self = this;
        self._addElementsToDom();
        body.addClass(self.options.blockUIClass);
      };
      BlockUI.prototype.unblockUI = function() {
        var self;
        self = this;
        body.removeClass(self.options.blockUIClass);
        this._removeElementsFromDom();
      };
      BlockUI.prototype.updateBlockUI = function(html) {
        this.messageEl.remove();
        this.messageEl = angular.element('<div>').css(this.messageBoxCss).html(html);

        body.append(this.messageEl);
      }
      BlockUI.prototype._addElementsToDom = function() {
        body.append(this.messageEl);
        body.append(this.backdropEl);
        this._blocked = true;
      };
      BlockUI.prototype._removeElementsFromDom = function() {
        this.messageEl.remove();
        this.backdropEl.remove();
        this._blocked = false;
      };
      return {
        createBlockUI: function(opts) {
          return new BlockUI(opts);
        }
      };
    }
  ];
});
