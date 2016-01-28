/*
	@license sc-date-time
	@author SimeonC
	@license 2015 MIT
	@version 1.1.6
	
	See README.md for requirements and use.
*/angular.module('scDateTime', []).value('scDateTimeConfig', {
  defaultTheme: 'material',
  autosave: false,
  defaultMode: 'date',
  defaultDate: void 0,
  displayMode: void 0,
  defaultOrientation: false,
  displayTwentyfour: false,
  compact: false
}).value('scDateTimeI18n', {
  previousMonth: "Previous Month",
  nextMonth: "Next Month",
  incrementHours: "Increment Hours",
  decrementHours: "Decrement Hours",
  incrementMinutes: "Increment Minutes",
  decrementMinutes: "Decrement Minutes",
  switchAmPm: "Switch AM/PM",
  now: "Now",
  cancel: "Cancel",
  save: "Save",
  weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  switchTo: 'Switch to',
  clock: 'Clock',
  calendar: 'Calendar'
}).directive('timeDatePicker', [
  '$filter', '$sce', '$rootScope', '$parse', 'scDateTimeI18n', 'scDateTimeConfig', function($filter, $sce, $rootScope, $parse, scDateTimeI18n, scDateTimeConfig) {
    var _dateFilter;
    _dateFilter = $filter('date');
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        _weekdays: '=?tdWeekdays'
      },
      require: 'ngModel',
      templateUrl: function(tElement, tAttrs) {
        if ((tAttrs.theme == null) || tAttrs.theme === '') {
          tAttrs.theme = scDateTimeConfig.defaultTheme;
        }
        if (tAttrs.theme.indexOf('/') <= 0) {
          return "scDateTime-" + tAttrs.theme + ".tpl";
        } else {
          return tAttrs.theme;
        }
      },
      link: function(scope, element, attrs, ngModel) {
        var cancelFn, saveFn;
          parseMindate(attrs.mindate);
          parseMaxdate(attrs.maxdate);
          attrs.$observe('defaultMode', function(val) {
          if (val !== 'time' && val !== 'date') {
            val = scDateTimeConfig.defaultMode;
          }
          return scope._mode = val;
        });
        attrs.$observe('defaultDate', function(val) {
          return scope._defaultDate = (val != null) && Date.parse(val) ? Date.parse(val) : scDateTimeConfig.defaultDate;
        });
        attrs.$observe('displayMode', function(val) {
          if (val !== 'full' && val !== 'time' && val !== 'date') {
            val = scDateTimeConfig.displayMode;
          }
          return scope._displayMode = val;
        });
        attrs.$observe('orientation', function(val) {
          return scope._verticalMode = val != null ? val === 'true' : scDateTimeConfig.defaultOrientation;
        });
        attrs.$observe('compact', function(val) {
          return scope._compact = val != null ? val === 'true' : scDateTimeConfig.compact;
        });
        attrs.$observe('displayTwentyfour', function(val) {
          return scope._hours24 = val != null ? scope.$eval(val) : scDateTimeConfig.displayTwentyfour;
        });
        /* delcam fix */
        attrs.$observe('config', function(val) {
          scope.translations = JSON.parse(val);
          scope._weekdays = JSON.parse(val).weekdays;
          return true;
        });
        attrs.$observe('mindate', parseMindate);
        function parseMindate(val) {
            if ((val != null) && Date.parse(val)) {
              scope.restrictions.mindate = new Date(val);
              return scope.restrictions.mindate.setHours(0, 0, 0, 0);
            }
        };
        attrs.$observe('maxdate', parseMaxdate);
        function parseMaxdate(val) {
            if ((val != null) && Date.parse(val)) {
                scope.restrictions.maxdate = new Date(val);
                return scope.restrictions.maxdate.setHours(23, 59, 59, 999);
            }
        };
        scope._weekdays = scope._weekdays || scDateTimeI18n.weekdays;
        scope.$watch('_weekdays', function(value) {
          if ((value == null) || !angular.isArray(value)) {
            return scope._weekdays = scDateTimeI18n.weekdays;
          }
        });
        ngModel.$render = function() {
          var ref;
          return scope.setDate((ref = ngModel.$modelValue) != null ? ref : scope._defaultDate, ngModel.$modelValue != null);
        };
        angular.forEach(element.find('input'), function(input) {
          return angular.element(input).on('focus', function() {
            return setTimeout((function() {
              return input.select();
            }), 10);
          });
        });
        scope.autosave = false;
        if ((attrs['autosave'] != null) || scDateTimeConfig.autosave) {
          scope.saveUpdateDate = function() {
            return ngModel.$setViewValue(scope.date);
          };
          return scope.autosave = true;
        } else {
          saveFn = $parse(attrs.onSave);
          cancelFn = $parse(attrs.onCancel);
          scope.saveUpdateDate = function() {
            return true;
          };
          scope.save = function() {
            ngModel.$setViewValue(new Date(scope.date));
            return saveFn(scope.$parent, {
              $value: new Date(scope.date)
            });
          };
          return scope.cancel = function() {
            cancelFn(scope.$parent, {});
            return ngModel.$render();
          };
        }
      },
      controller: [
        '$scope', 'scDateTimeI18n', '$attrs', '$interpolate', function(scope, scDateTimeI18n, $attrs, $interpolate) {
          var i;
          scope._defaultDate = scDateTimeConfig.defaultDate;
          scope._mode = scDateTimeConfig.defaultMode;
          scope._displayMode = scDateTimeConfig.displayMode;
          scope._verticalMode = scDateTimeConfig.defaultOrientation;
          scope._hours24 = $interpolate($attrs.displayTwentyfour)(scope.$parent) == 'true' || scDateTimeConfig.displayTwentyfour;
          scope._compact = scDateTimeConfig.compact;
          scope.translations = scDateTimeI18n;
          scope.restrictions = {
            mindate: void 0,
            maxdate: void 0
          };
          scope.setDate = function(newVal, save) {
            if (save == null) {
              save = true;
            }
            scope.date = newVal ? new Date(newVal) : new Date();
            scope.calendar._year = scope.restrictions.maxdate && scope.date.getFullYear() > scope.restrictions.maxdate.getFullYear() ? scope.restrictions.maxdate.getFullYear() : scope.date.getFullYear();
            scope.calendar._month = scope.date.getMonth();
            scope.clock._minutes = scope.date.getMinutes();
            scope.clock._hours = scope._hours24 ? scope.date.getHours() : scope.date.getHours() % 12;
            if (!scope._hours24 && scope.clock._hours === 0) {
              scope.clock._hours = 12;
            }
            return scope.calendar.yearChange(save);
          };
          scope.display = {
            fullTitle: function() {
              var _timeString;
              _timeString = scope._hours24 ? 'HH:mm' : 'h:mm a';
              if (scope._displayMode === 'full' && !scope._verticalMode) {
                return _dateFilter(scope.date, "EEEE d MMMM yyyy, " + _timeString);
              } else if (scope._displayMode === 'time') {
                return _dateFilter(scope.date, _timeString);
              } else if (scope._displayMode === 'date') {
                return _dateFilter(scope.date, 'EEE d MMM yyyy');
              } else {
                return _dateFilter(scope.date, "d MMM yyyy, " + _timeString);
              }
            },
            title: function() {
              if (scope._mode === 'date') {
                return _dateFilter(scope.date, (scope._displayMode === 'date' ? 'EEEE' : "EEEE " + (scope._hours24 ? 'HH:mm' : 'h:mm a')));
              } else {
                return _dateFilter(scope.date, 'MMMM d yyyy');
              }
            },
            "super": function() {
              if (scope._mode === 'date') {
                return _dateFilter(scope.date, 'MMM');
              } else {
                return '';
              }
            },
            main: function() {
              return $sce.trustAsHtml(scope._mode === 'date' ? _dateFilter(scope.date, 'd') : scope._hours24 ? _dateFilter(scope.date, 'HH:mm') : (_dateFilter(scope.date, 'h:mm')) + "<small>" + (_dateFilter(scope.date, 'a')) + "</small>");
            },
            sub: function() {
              if (scope._mode === 'date') {
                return _dateFilter(scope.date, 'yyyy');
              } else {
                return _dateFilter(scope.date, 'HH:mm');
              }
            }
          };
          scope.calendar = {
            _month: 0,
            _year: 0,
            _months: [],
            _allMonths: (function() {
              var j, results;
              results = [];
              for (i = j = 0; j <= 11; i = ++j) {
                results.push(_dateFilter(new Date(0, i), 'MMMM'));
              }
              return results;
            })(),
            offsetMargin: function() {
              return (new Date(this._year, this._month).getDay() * 2.7) + "rem";
            },
            isVisible: function(d) {
              return new Date(this._year, this._month, d).getMonth() === this._month;
            },
            isDisabled: function(d) {
              var currentDate, maxdate, mindate;
              currentDate = new Date(this._year, this._month, d);
              mindate = scope.restrictions.mindate;
              maxdate = scope.restrictions.maxdate;
              return ((mindate != null) && currentDate < mindate) || ((maxdate != null) && currentDate > maxdate);
            },
            isPrevMonthButtonHidden: function() {
              var date;
              date = scope.restrictions["mindate"];
              return (date != null) && this._month <= date.getMonth() && this._year <= date.getFullYear();
            },
            isNextMonthButtonHidden: function() {
              var date;
              date = scope.restrictions["maxdate"];
              return (date != null) && this._month >= date.getMonth() && this._year >= date.getFullYear();
            },
            "class": function(d) {
              var classString;
              classString = '';
              if ((scope.date != null) && new Date(this._year, this._month, d).getTime() === new Date(scope.date.getTime()).setHours(0, 0, 0, 0)) {
                classString += "selected";
              }
              if (new Date(this._year, this._month, d).getTime() === new Date().setHours(0, 0, 0, 0)) {
                classString += " today";
              }
              return classString;
            },
            select: function(d) {
              scope.date.setFullYear(this._year, this._month, d);
              return scope.saveUpdateDate();
            },
            monthChange: function(save) {
              var maxdate, mindate;
              if (save == null) {
                save = true;
              }
              if ((this._year == null) || isNaN(this._year)) {
                this._year = new Date().getFullYear();
              }
              mindate = scope.restrictions.mindate;
              maxdate = scope.restrictions.maxdate;
              if ((mindate != null) && mindate.getFullYear() === this._year && mindate.getMonth() >= this._month) {
                this._month = Math.max(mindate.getMonth(), this._month);
              }
              if ((maxdate != null) && maxdate.getFullYear() === this._year && maxdate.getMonth() <= this._month) {
                this._month = Math.min(maxdate.getMonth(), this._month);
              }
              scope.date.setFullYear(this._year, this._month);
              if (scope.date.getMonth() !== this._month) {
                scope.date.setDate(0);
              }
              if ((mindate != null) && scope.date < mindate) {
                scope.date.setDate(mindate.getDate());
                scope.calendar.select(mindate.getDate());
              }
              if ((maxdate != null) && scope.date > maxdate) {
                scope.date.setDate(maxdate.getDate());
                scope.calendar.select(maxdate.getDate());
              }
              if (save) {
                return scope.saveUpdateDate();
              }
            },
            _incMonth: function(months) {
              this._month += months;
              while (this._month < 0 || this._month > 11) {
                if (this._month < 0) {
                  this._month += 12;
                  this._year--;
                } else {
                  this._month -= 12;
                  this._year++;
                }
              }
              return this.monthChange();
            },
            yearChange: function(save) {
              var len, maxdate, mindate;
              if (save == null) {
                save = true;
              }
              if ((scope.calendar._year == null) || scope.calendar._year === '') {
                return;
              }
              mindate = scope.restrictions.mindate;
              maxdate = scope.restrictions.maxdate;
              i = (mindate != null) && mindate.getFullYear() === scope.calendar._year ? mindate.getMonth() : 0;
              len = (maxdate != null) && maxdate.getFullYear() === scope.calendar._year ? maxdate.getMonth() : 11;
              scope.calendar._months = scope.calendar._allMonths.slice(i, len + 1);
              return scope.calendar.monthChange(save);
            }
          };
          scope.clock = {
            _minutes: 0,
            _hours: 0,
            _incHours: function(inc) {
              var i = this._hours + inc;
              i = !scope._hours24 && i==13 ? 1 : i;
              i = !scope._hours24 && i==0 ? 12 : i;
              this._hours = scope._hours24 ? Math.max(0, Math.min(23, i)) : Math.max(1, Math.min(12, i));
              if (isNaN(this._hours)) {
                return this._hours = 1;
              }
            },
            _incMinutes: function(inc) {
              this._minutes = Math.max(0, Math.min(59, this._minutes + inc));
              if (isNaN(this._minutes)) {
                return this._minutes = 0;
              }
            },
            setAM: function(b) {
              if (b == null) {
                b = !this.isAM();
              }
              if (b && !this.isAM()) {
                scope.date.setHours(scope.date.getHours() - 12);
              } else if (!b && this.isAM()) {
                scope.date.setHours(scope.date.getHours() + 12);
              }
              return scope.saveUpdateDate();
            },
            isAM: function() {
              return scope.date.getHours() < 12;
            }
          };
          scope.$watch('clock._minutes', function(val, oldVal) {
            if ((val != null) && val !== scope.date.getMinutes() && !isNaN(val) && (0 <= val && val <= 59)) {
              scope.date.setMinutes(val);
              return scope.saveUpdateDate();
            }
          });
          scope.$watch('clock._hours', function(val) {
            if ((val != null) && !isNaN(val)) {
              if (!scope._hours24) {
                if (val === 12) {
                    if (scope.date.getHours() == 11) {
                        val = 12;
                    }
                    else if (scope.date.getHours() == 23) {
                        val = 0;
                    }
                    else if (scope.date.getHours() == 13) {
                        val = 12;
                    }
                    else if (scope.date.getHours() == 1) {
                        val = 0;
                    }
                    else if (!scope.clock.isAM()) {
                        val += 12;
                    }
                }
                else if (val == 11){
                    if(scope.date.getHours() == 0)
                    {
                        val = 23;
                    }else if(scope.date.getHours() == 12){
                        val = 11;
                    }
                    else if (!scope.clock.isAM()) {
                        val += 12;
                    }
                }
                else if (!scope.clock.isAM()) {
                    val += 12;
                }
              }
              if (val !== scope.date.getHours()) {
                scope.date.setHours(val);
                return scope.saveUpdateDate();
              }
            }
          });
          scope.setNow = function() {
            scope.setDate();
            return scope.saveUpdateDate();
          };
          scope.modeClass = function() {
            if (scope._displayMode != null) {
              scope._mode = scope._displayMode;
            }
            return "" + (scope._verticalMode ? 'vertical ' : '') + (scope._displayMode === 'full' ? 'full-mode' : scope._displayMode === 'time' ? 'time-only' : scope._displayMode === 'date' ? 'date-only' : scope._mode === 'date' ? 'date-mode' : 'time-mode') + " " + (scope._compact ? 'compact' : '');
          };
          scope.modeSwitch = function() {
            var ref;
            return scope._mode = (ref = scope._displayMode) != null ? ref : scope._mode === 'date' ? 'time' : 'date';
          };
          return scope.modeSwitchText = function() {
            return scDateTimeI18n.switchTo + ' ' + (scope._mode === 'date' ? scDateTimeI18n.clock : scDateTimeI18n.calendar);
          };
        }
      ]
    };
  }
]);

'use strict';

angular.module('scDateTime').run(['$templateCache', function($templateCache) {

  $templateCache.put('scDateTime-bootstrap.tpl', '<div ng-class="modeClass()" class="time-date"><div ng-click="modeSwitch()" class="display"><div class="title">{{display.title()}}</div><div class="content"><div class="super-title">{{display.super()}}</div><div ng-bind-html="display.main()" class="main-title"></div><div class="sub-title">{{display.sub()}}</div></div></div><div class="control"><div class="full-title">{{display.fullTitle()}}</div><div class="slider"><div class="date-control"><div class="title"><button type="button" ng-click="calendar._incMonth(-1)" style="float: left" ng-class="{\'visuallyhidden\': calendar.isPrevMonthButtonHidden()}" class="btn btn-link"><i class="fa fa-caret-left"></i></button><span class="month-part">{{date | date:\'MMMM\'}}<select ng-model="calendar._month" ng-change="calendar.monthChange()" ng-options="calendar._allMonths.indexOf(month) as month for month in calendar._months"></select></span> <input ng-model="calendar._year" ng-change="calendar.yearChange()" type="number" min="{{restrictions.mindate ? restrictions.mindate.getFullYear() : 0}}" max="{{restrictions.maxdate ? restrictions.maxdate.getFullYear() : NaN}}" class="year-part"> <button type="button" ng-click="calendar._incMonth(1)" style="float: right" ng-class="{\'visuallyhidden\': calendar.isNextMonthButtonHidden()}" class="btn btn-link"><i class="fa fa-caret-right"></i></button></div><div class="headers"><div ng-repeat="day in _weekdays track by $index" class="day-cell">{{day}}</div></div><div class="days"><button type="button" ng-style="{\'margin-left\': calendar.offsetMargin()}" ng-class="calendar.class(1)" ng-disabled="calendar.isDisabled(1)" ng-show="calendar.isVisible(1)" ng-click="calendar.select(1)" class="btn btn-link day-cell">1</button> <button type="button" ng-class="calendar.class(2)" ng-show="calendar.isVisible(2)" ng-disabled="calendar.isDisabled(2)" ng-click="calendar.select(2)" class="btn btn-link day-cell">2</button> <button type="button" ng-class="calendar.class(3)" ng-show="calendar.isVisible(3)" ng-disabled="calendar.isDisabled(3)" ng-click="calendar.select(3)" class="btn btn-link day-cell">3</button> <button type="button" ng-class="calendar.class(4)" ng-show="calendar.isVisible(4)" ng-disabled="calendar.isDisabled(4)" ng-click="calendar.select(4)" class="btn btn-link day-cell">4</button> <button type="button" ng-class="calendar.class(5)" ng-show="calendar.isVisible(5)" ng-disabled="calendar.isDisabled(5)" ng-click="calendar.select(5)" class="btn btn-link day-cell">5</button> <button type="button" ng-class="calendar.class(6)" ng-show="calendar.isVisible(6)" ng-disabled="calendar.isDisabled(6)" ng-click="calendar.select(6)" class="btn btn-link day-cell">6</button> <button type="button" ng-class="calendar.class(7)" ng-show="calendar.isVisible(7)" ng-disabled="calendar.isDisabled(7)" ng-click="calendar.select(7)" class="btn btn-link day-cell">7</button> <button type="button" ng-class="calendar.class(8)" ng-show="calendar.isVisible(8)" ng-disabled="calendar.isDisabled(8)" ng-click="calendar.select(8)" class="btn btn-link day-cell">8</button> <button type="button" ng-class="calendar.class(9)" ng-show="calendar.isVisible(9)" ng-disabled="calendar.isDisabled(9)" ng-click="calendar.select(9)" class="btn btn-link day-cell">9</button> <button type="button" ng-class="calendar.class(10)" ng-show="calendar.isVisible(10)" ng-disabled="calendar.isDisabled(10)" ng-click="calendar.select(10)" class="btn btn-link day-cell">10</button> <button type="button" ng-class="calendar.class(11)" ng-show="calendar.isVisible(11)" ng-disabled="calendar.isDisabled(11)" ng-click="calendar.select(11)" class="btn btn-link day-cell">11</button> <button type="button" ng-class="calendar.class(12)" ng-show="calendar.isVisible(12)" ng-disabled="calendar.isDisabled(12)" ng-click="calendar.select(12)" class="btn btn-link day-cell">12</button> <button type="button" ng-class="calendar.class(13)" ng-show="calendar.isVisible(13)" ng-disabled="calendar.isDisabled(13)" ng-click="calendar.select(13)" class="btn btn-link day-cell">13</button> <button type="button" ng-class="calendar.class(14)" ng-show="calendar.isVisible(14)" ng-disabled="calendar.isDisabled(14)" ng-click="calendar.select(14)" class="btn btn-link day-cell">14</button> <button type="button" ng-class="calendar.class(15)" ng-show="calendar.isVisible(15)" ng-disabled="calendar.isDisabled(15)" ng-click="calendar.select(15)" class="btn btn-link day-cell">15</button> <button type="button" ng-class="calendar.class(16)" ng-show="calendar.isVisible(16)" ng-disabled="calendar.isDisabled(16)" ng-click="calendar.select(16)" class="btn btn-link day-cell">16</button> <button type="button" ng-class="calendar.class(17)" ng-show="calendar.isVisible(17)" ng-disabled="calendar.isDisabled(17)" ng-click="calendar.select(17)" class="btn btn-link day-cell">17</button> <button type="button" ng-class="calendar.class(18)" ng-show="calendar.isVisible(18)" ng-disabled="calendar.isDisabled(18)" ng-click="calendar.select(18)" class="btn btn-link day-cell">18</button> <button type="button" ng-class="calendar.class(19)" ng-show="calendar.isVisible(19)" ng-disabled="calendar.isDisabled(19)" ng-click="calendar.select(19)" class="btn btn-link day-cell">19</button> <button type="button" ng-class="calendar.class(20)" ng-show="calendar.isVisible(20)" ng-disabled="calendar.isDisabled(20)" ng-click="calendar.select(20)" class="btn btn-link day-cell">20</button> <button type="button" ng-class="calendar.class(21)" ng-show="calendar.isVisible(21)" ng-disabled="calendar.isDisabled(21)" ng-click="calendar.select(21)" class="btn btn-link day-cell">21</button> <button type="button" ng-class="calendar.class(22)" ng-show="calendar.isVisible(22)" ng-disabled="calendar.isDisabled(22)" ng-click="calendar.select(22)" class="btn btn-link day-cell">22</button> <button type="button" ng-class="calendar.class(23)" ng-show="calendar.isVisible(23)" ng-disabled="calendar.isDisabled(23)" ng-click="calendar.select(23)" class="btn btn-link day-cell">23</button> <button type="button" ng-class="calendar.class(24)" ng-show="calendar.isVisible(24)" ng-disabled="calendar.isDisabled(24)" ng-click="calendar.select(24)" class="btn btn-link day-cell">24</button> <button type="button" ng-class="calendar.class(25)" ng-show="calendar.isVisible(25)" ng-disabled="calendar.isDisabled(25)" ng-click="calendar.select(25)" class="btn btn-link day-cell">25</button> <button type="button" ng-class="calendar.class(26)" ng-show="calendar.isVisible(26)" ng-disabled="calendar.isDisabled(26)" ng-click="calendar.select(26)" class="btn btn-link day-cell">26</button> <button type="button" ng-class="calendar.class(27)" ng-show="calendar.isVisible(27)" ng-disabled="calendar.isDisabled(27)" ng-click="calendar.select(27)" class="btn btn-link day-cell">27</button> <button type="button" ng-class="calendar.class(28)" ng-show="calendar.isVisible(28)" ng-disabled="calendar.isDisabled(28)" ng-click="calendar.select(28)" class="btn btn-link day-cell">28</button> <button type="button" ng-class="calendar.class(29)" ng-show="calendar.isVisible(29)" ng-disabled="calendar.isDisabled(29)" ng-click="calendar.select(29)" class="btn btn-link day-cell">29</button> <button type="button" ng-class="calendar.class(30)" ng-show="calendar.isVisible(30)" ng-disabled="calendar.isDisabled(30)" ng-click="calendar.select(30)" class="btn btn-link day-cell">30</button> <button type="button" ng-class="calendar.class(31)" ng-show="calendar.isVisible(31)" ng-disabled="calendar.isDisabled(31)" ng-click="calendar.select(31)" class="btn btn-link day-cell">31</button></div></div><button type="button" ng-click="modeSwitch()" class="btn btn-link switch-control"><i class="fa fa-clock-o"></i><i class="fa fa-calendar"></i><span class="visuallyhidden">{{modeSwitchText()}}</span></button><div class="time-control"><div class="time-inputs"><input type="number" min="{{_hours24 ? 0 : 1}}" max="{{_hours24 ? 23 : 12}}" ng-model="clock._hours"> <button type="button" ng-click="clock._incHours(1)" class="btn btn-link hours up"><i class="fa fa-caret-up"></i></button> <button type="button" ng-click="clock._incHours(-1)" class="btn btn-link hours down"><i class="fa fa-caret-down"></i></button> <input type="number" min="0" max="59" ng-model="clock._minutes"> <button type="button" ng-click="clock._incMinutes(1)" class="btn btn-link minutes up"><i class="fa fa-caret-up"></i></button> <button type="button" ng-click="clock._incMinutes(-1)" class="btn btn-link minutes down"><i class="fa fa-caret-down"></i></button></div><div ng-if="!_hours24" class="buttons"><button type="button" ng-click="clock.setAM()" class="btn btn-link">{{date | date:\'a\'}}</button></div></div></div></div><div class="buttons"><button type="button" ng-click="setNow()" class="btn btn-link">{{:: translations.now}}</button> <button type="button" ng-click="cancel()" ng-if="!autosave" class="btn btn-link">{{:: translations.cancel}}</button> <button type="button" ng-click="save()" ng-if="!autosave" class="btn btn-link">{{:: translations.save}}</button></div></div>');

}]);
'use strict';

angular.module('scDateTime').run(['$templateCache', function($templateCache) {

  $templateCache.put('scDateTime-material.tpl', '<div ng-class="modeClass()" class="time-date"><div ng-click="modeSwitch()" aria-label="{{modeSwitchText()}}" class="display"><div class="title">{{display.title()}}</div><div class="content"><div class="super-title">{{display.super()}}</div><div ng-bind-html="display.main()" class="main-title"></div><div class="sub-title">{{display.sub()}}</div></div></div><div class="control"><div class="full-title">{{display.fullTitle()}}</div><div class="slider"><div class="date-control"><div class="title"><md-button type="button" ng-click="calendar._incMonth(-1)" aria-label="{{:: translations.previousMonth}}" style="float: left" ng-class="{\'visuallyhidden\': calendar.isPrevMonthButtonHidden()}"><i class="fa fa-caret-left"></i></md-button><span class="month-part">{{date | date:\'MMMM\'}}<select ng-model="calendar._month" ng-change="calendar.monthChange()" ng-options="calendar._allMonths.indexOf(month) as month for month in calendar._months"></select></span> <input ng-model="calendar._year" ng-change="calendar.yearChange()" type="number" min="{{restrictions.mindate ? restrictions.mindate.getFullYear() : 0}}" max="{{restrictions.maxdate ? restrictions.maxdate.getFullYear() : NaN}}" class="year-part"><md-button type="button" ng-click="calendar._incMonth(1)" aria-label="{{:: translations.nextMonth}}" style="float: right" ng-class="{\'visuallyhidden\': calendar.isNextMonthButtonHidden()}"><i class="fa fa-caret-right"></i></md-button></div><div class="headers"><div ng-repeat="day in _weekdays track by $index" class="day-cell">{{day}}</div></div><div class="days"><md-button type="button" ng-style="{\'margin-left\': calendar.offsetMargin()}" ng-class="calendar.class(1)" ng-disabled="calendar.isDisabled(1)" ng-show="calendar.isVisible(1)" ng-click="calendar.select(1)" aria-label="1" class="day-cell">1</md-button><md-button type="button" ng-class="calendar.class(2)" ng-show="calendar.isVisible(2)" ng-disabled="calendar.isDisabled(2)" ng-click="calendar.select(2)" aria-label="2" class="day-cell">2</md-button><md-button type="button" ng-class="calendar.class(3)" ng-show="calendar.isVisible(3)" ng-disabled="calendar.isDisabled(3)" ng-click="calendar.select(3)" aria-label="3" class="day-cell">3</md-button><md-button type="button" ng-class="calendar.class(4)" ng-show="calendar.isVisible(4)" ng-disabled="calendar.isDisabled(4)" ng-click="calendar.select(4)" aria-label="4" class="day-cell">4</md-button><md-button type="button" ng-class="calendar.class(5)" ng-show="calendar.isVisible(5)" ng-disabled="calendar.isDisabled(5)" ng-click="calendar.select(5)" aria-label="5" class="day-cell">5</md-button><md-button type="button" ng-class="calendar.class(6)" ng-show="calendar.isVisible(6)" ng-disabled="calendar.isDisabled(6)" ng-click="calendar.select(6)" aria-label="6" class="day-cell">6</md-button><md-button type="button" ng-class="calendar.class(7)" ng-show="calendar.isVisible(7)" ng-disabled="calendar.isDisabled(7)" ng-click="calendar.select(7)" aria-label="7" class="day-cell">7</md-button><md-button type="button" ng-class="calendar.class(8)" ng-show="calendar.isVisible(8)" ng-disabled="calendar.isDisabled(8)" ng-click="calendar.select(8)" aria-label="8" class="day-cell">8</md-button><md-button type="button" ng-class="calendar.class(9)" ng-show="calendar.isVisible(9)" ng-disabled="calendar.isDisabled(9)" ng-click="calendar.select(9)" aria-label="9" class="day-cell">9</md-button><md-button type="button" ng-class="calendar.class(10)" ng-show="calendar.isVisible(10)" ng-disabled="calendar.isDisabled(10)" ng-click="calendar.select(10)" aria-label="10" class="day-cell">10</md-button><md-button type="button" ng-class="calendar.class(11)" ng-show="calendar.isVisible(11)" ng-disabled="calendar.isDisabled(11)" ng-click="calendar.select(11)" aria-label="11" class="day-cell">11</md-button><md-button type="button" ng-class="calendar.class(12)" ng-show="calendar.isVisible(12)" ng-disabled="calendar.isDisabled(12)" ng-click="calendar.select(12)" aria-label="12" class="day-cell">12</md-button><md-button type="button" ng-class="calendar.class(13)" ng-show="calendar.isVisible(13)" ng-disabled="calendar.isDisabled(13)" ng-click="calendar.select(13)" aria-label="13" class="day-cell">13</md-button><md-button type="button" ng-class="calendar.class(14)" ng-show="calendar.isVisible(14)" ng-disabled="calendar.isDisabled(14)" ng-click="calendar.select(14)" aria-label="14" class="day-cell">14</md-button><md-button type="button" ng-class="calendar.class(15)" ng-show="calendar.isVisible(15)" ng-disabled="calendar.isDisabled(15)" ng-click="calendar.select(15)" aria-label="15" class="day-cell">15</md-button><md-button type="button" ng-class="calendar.class(16)" ng-show="calendar.isVisible(16)" ng-disabled="calendar.isDisabled(16)" ng-click="calendar.select(16)" aria-label="16" class="day-cell">16</md-button><md-button type="button" ng-class="calendar.class(17)" ng-show="calendar.isVisible(17)" ng-disabled="calendar.isDisabled(17)" ng-click="calendar.select(17)" aria-label="17" class="day-cell">17</md-button><md-button type="button" ng-class="calendar.class(18)" ng-show="calendar.isVisible(18)" ng-disabled="calendar.isDisabled(18)" ng-click="calendar.select(18)" aria-label="18" class="day-cell">18</md-button><md-button type="button" ng-class="calendar.class(19)" ng-show="calendar.isVisible(19)" ng-disabled="calendar.isDisabled(19)" ng-click="calendar.select(19)" aria-label="19" class="day-cell">19</md-button><md-button type="button" ng-class="calendar.class(20)" ng-show="calendar.isVisible(20)" ng-disabled="calendar.isDisabled(20)" ng-click="calendar.select(20)" aria-label="20" class="day-cell">20</md-button><md-button type="button" ng-class="calendar.class(21)" ng-show="calendar.isVisible(21)" ng-disabled="calendar.isDisabled(21)" ng-click="calendar.select(21)" aria-label="21" class="day-cell">21</md-button><md-button type="button" ng-class="calendar.class(22)" ng-show="calendar.isVisible(22)" ng-disabled="calendar.isDisabled(22)" ng-click="calendar.select(22)" aria-label="22" class="day-cell">22</md-button><md-button type="button" ng-class="calendar.class(23)" ng-show="calendar.isVisible(23)" ng-disabled="calendar.isDisabled(23)" ng-click="calendar.select(23)" aria-label="23" class="day-cell">23</md-button><md-button type="button" ng-class="calendar.class(24)" ng-show="calendar.isVisible(24)" ng-disabled="calendar.isDisabled(24)" ng-click="calendar.select(24)" aria-label="24" class="day-cell">24</md-button><md-button type="button" ng-class="calendar.class(25)" ng-show="calendar.isVisible(25)" ng-disabled="calendar.isDisabled(25)" ng-click="calendar.select(25)" aria-label="25" class="day-cell">25</md-button><md-button type="button" ng-class="calendar.class(26)" ng-show="calendar.isVisible(26)" ng-disabled="calendar.isDisabled(26)" ng-click="calendar.select(26)" aria-label="26" class="day-cell">26</md-button><md-button type="button" ng-class="calendar.class(27)" ng-show="calendar.isVisible(27)" ng-disabled="calendar.isDisabled(27)" ng-click="calendar.select(27)" aria-label="27" class="day-cell">27</md-button><md-button type="button" ng-class="calendar.class(28)" ng-show="calendar.isVisible(28)" ng-disabled="calendar.isDisabled(28)" ng-click="calendar.select(28)" aria-label="28" class="day-cell">28</md-button><md-button type="button" ng-class="calendar.class(29)" ng-show="calendar.isVisible(29)" ng-disabled="calendar.isDisabled(29)" ng-click="calendar.select(29)" aria-label="29" class="day-cell">29</md-button><md-button type="button" ng-class="calendar.class(30)" ng-show="calendar.isVisible(30)" ng-disabled="calendar.isDisabled(30)" ng-click="calendar.select(30)" aria-label="30" class="day-cell">30</md-button><md-button type="button" ng-class="calendar.class(31)" ng-show="calendar.isVisible(31)" ng-disabled="calendar.isDisabled(31)" ng-click="calendar.select(31)" aria-label="31" class="day-cell">31</md-button></div></div><md-button type="button" ng-click="modeSwitch()" aria-label="{{modeSwitchText()}}" class="switch-control"><i class="fa fa-clock-o"></i><i class="fa fa-calendar"></i><span class="visuallyhidden">{{modeSwitchText()}}</span></md-button><div class="time-control"><div class="time-inputs"><input type="number" min="{{_hours24 ? 0 : 1}}" max="{{_hours24 ? 23 : 12}}" ng-model="clock._hours"><md-button type="button" ng-click="clock._incHours(1)" aria-label="{{:: translations.incrementHours}}" class="hours up"><i class="fa fa-caret-up"></i></md-button><md-button type="button" ng-click="clock._incHours(-1)" aria-label="{{:: translations.decrementHours}}" class="hours down"><i class="fa fa-caret-down"></i></md-button><input type="number" min="0" max="59" ng-model="clock._minutes"><md-button type="button" ng-click="clock._incMinutes(1)" aria-label="{{:: translations.incrementMinutes}}" class="minutes up"><i class="fa fa-caret-up"></i></md-button><md-button type="button" ng-click="clock._incMinutes(-1)" aria-label="{{:: translations.decrementMinutes}}" class="minutes down"><i class="fa fa-caret-down"></i></md-button></div><div ng-if="!_hours24" class="buttons"><md-button type="button" ng-click="clock.setAM()" aria-label="{{:: translations.switchAmPm}}">{{date | date:\'a\'}}</md-button></div></div></div></div><div class="buttons"><md-button type="button" ng-click="setNow()" aria-label="{{:: translations.now}}">{{:: translations.now}}</md-button><md-button type="button" ng-click="cancel()" ng-if="!autosave" aria-label="{{:: translations.cancel}}">{{:: translations.cancel}}</md-button><md-button type="button" ng-click="save()" ng-if="!autosave" aria-label="{{:: translations.save}}">{{:: translations.save}}</md-button></div></div>');

}]);