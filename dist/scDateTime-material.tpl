
<div ng-class="modeClass()" class="time-date">
  <div ng-click="modeSwitch()" aria-label="{{modeSwitchText()}}" class="display">
    <div class="title">{{display.title()}}</div>
    <div class="content">
      <div class="super-title">{{display.super()}}</div>
      <div ng-bind-html="display.main()" class="main-title"></div>
      <div class="sub-title">{{display.sub()}}</div>
    </div>
  </div>
  <div class="control">
    <div class="full-title">{{display.fullTitle()}}</div>
    <div class="slider"> 
      <div class="date-control">
        <div class="title">
          <md-button ng-click="calendar._incMonth(-1)" aria-label="{{:: translations.previousMonth}}" style="float: left;" ng-class="{'visuallyhidden': calendar.isVisibleMonthButton('mindate')}" type="button"><i class="fa fa-caret-left"></i></md-button><span class="month-part">{{date | date:'MMMM'}}
            <select ng-model="calendar._month" ng-change="calendar.monthChange()" ng-options="calendar._allMonths.indexOf(month) as month for month in calendar._months"></select></span>
          <input ng-model="calendar._year" ng-change="calendar.yearChange()" type="number" min="{{restrictions.mindate ? restrictions.mindate.getFullYear() : 0}}" max="{{restrcitions.maxdate ? restrictions.maxdate.getFullYear() : NaN}}" class="year-part"/>
          <md-button ng-click="calendar._incMonth(1)" aria-label="{{:: translations.nextMonth}}" style="float: right;" ng-class="{'visuallyhidden': calendar.isVisibleMonthButton('maxdate')}" type="button"><i class="fa fa-caret-right"></i></md-button>
        </div>
        <div class="headers">
          <div ng-repeat="day in _weekdays track by $index" class="day-cell">{{day}}</div>
        </div>
        <div class="days">
          <md-button ng-style="{'margin-left': calendar.offsetMargin()}" ng-class="calendar.class(1)" ng-disabled="calendar.isDisabled(1)" ng-show="calendar.isVisible(1)" ng-click="calendar.select(1)" type="button" aria-label="1" class="day-cell">1</md-button>
          <md-button ng-class="calendar.class(2)" ng-show="calendar.isVisible(2)" ng-disabled="calendar.isDisabled(2)" ng-click="calendar.select(2)" type="button" aria-label="2" class="day-cell">2</md-button>
          <md-button ng-class="calendar.class(3)" ng-show="calendar.isVisible(3)" ng-disabled="calendar.isDisabled(3)" ng-click="calendar.select(3)" type="button" aria-label="3" class="day-cell">3</md-button>
          <md-button ng-class="calendar.class(4)" ng-show="calendar.isVisible(4)" ng-disabled="calendar.isDisabled(4)" ng-click="calendar.select(4)" type="button" aria-label="4" class="day-cell">4</md-button>
          <md-button ng-class="calendar.class(5)" ng-show="calendar.isVisible(5)" ng-disabled="calendar.isDisabled(5)" ng-click="calendar.select(5)" type="button" aria-label="5" class="day-cell">5</md-button>
          <md-button ng-class="calendar.class(6)" ng-show="calendar.isVisible(6)" ng-disabled="calendar.isDisabled(6)" ng-click="calendar.select(6)" type="button" aria-label="6" class="day-cell">6</md-button>
          <md-button ng-class="calendar.class(7)" ng-show="calendar.isVisible(7)" ng-disabled="calendar.isDisabled(7)" ng-click="calendar.select(7)" type="button" aria-label="7" class="day-cell">7</md-button>
          <md-button ng-class="calendar.class(8)" ng-show="calendar.isVisible(8)" ng-disabled="calendar.isDisabled(8)" ng-click="calendar.select(8)" type="button" aria-label="8" class="day-cell">8</md-button>
          <md-button ng-class="calendar.class(9)" ng-show="calendar.isVisible(9)" ng-disabled="calendar.isDisabled(9)" ng-click="calendar.select(9)" type="button" aria-label="9" class="day-cell">9</md-button>
          <md-button ng-class="calendar.class(10)" ng-show="calendar.isVisible(10)" ng-disabled="calendar.isDisabled(10)" ng-click="calendar.select(10)" type="button" aria-label="10" class="day-cell">10</md-button>
          <md-button ng-class="calendar.class(11)" ng-show="calendar.isVisible(11)" ng-disabled="calendar.isDisabled(11)" ng-click="calendar.select(11)" type="button" aria-label="11" class="day-cell">11</md-button>
          <md-button ng-class="calendar.class(12)" ng-show="calendar.isVisible(12)" ng-disabled="calendar.isDisabled(12)" ng-click="calendar.select(12)" type="button" aria-label="12" class="day-cell">12</md-button>
          <md-button ng-class="calendar.class(13)" ng-show="calendar.isVisible(13)" ng-disabled="calendar.isDisabled(13)" ng-click="calendar.select(13)" type="button" aria-label="13" class="day-cell">13</md-button>
          <md-button ng-class="calendar.class(14)" ng-show="calendar.isVisible(14)" ng-disabled="calendar.isDisabled(14)" ng-click="calendar.select(14)" type="button" aria-label="14" class="day-cell">14</md-button>
          <md-button ng-class="calendar.class(15)" ng-show="calendar.isVisible(15)" ng-disabled="calendar.isDisabled(15)" ng-click="calendar.select(15)" type="button" aria-label="15" class="day-cell">15</md-button>
          <md-button ng-class="calendar.class(16)" ng-show="calendar.isVisible(16)" ng-disabled="calendar.isDisabled(16)" ng-click="calendar.select(16)" type="button" aria-label="16" class="day-cell">16</md-button>
          <md-button ng-class="calendar.class(17)" ng-show="calendar.isVisible(17)" ng-disabled="calendar.isDisabled(17)" ng-click="calendar.select(17)" type="button" aria-label="17" class="day-cell">17</md-button>
          <md-button ng-class="calendar.class(18)" ng-show="calendar.isVisible(18)" ng-disabled="calendar.isDisabled(18)" ng-click="calendar.select(18)" type="button" aria-label="18" class="day-cell">18</md-button>
          <md-button ng-class="calendar.class(19)" ng-show="calendar.isVisible(19)" ng-disabled="calendar.isDisabled(19)" ng-click="calendar.select(19)" type="button" aria-label="19" class="day-cell">19</md-button>
          <md-button ng-class="calendar.class(20)" ng-show="calendar.isVisible(20)" ng-disabled="calendar.isDisabled(20)" ng-click="calendar.select(20)" type="button" aria-label="20" class="day-cell">20</md-button>
          <md-button ng-class="calendar.class(21)" ng-show="calendar.isVisible(21)" ng-disabled="calendar.isDisabled(21)" ng-click="calendar.select(21)" type="button" aria-label="21" class="day-cell">21</md-button>
          <md-button ng-class="calendar.class(22)" ng-show="calendar.isVisible(22)" ng-disabled="calendar.isDisabled(22)" ng-click="calendar.select(22)" type="button" aria-label="22" class="day-cell">22</md-button>
          <md-button ng-class="calendar.class(23)" ng-show="calendar.isVisible(23)" ng-disabled="calendar.isDisabled(23)" ng-click="calendar.select(23)" type="button" aria-label="23" class="day-cell">23</md-button>
          <md-button ng-class="calendar.class(24)" ng-show="calendar.isVisible(24)" ng-disabled="calendar.isDisabled(24)" ng-click="calendar.select(24)" type="button" aria-label="24" class="day-cell">24</md-button>
          <md-button ng-class="calendar.class(25)" ng-show="calendar.isVisible(25)" ng-disabled="calendar.isDisabled(25)" ng-click="calendar.select(25)" type="button" aria-label="25" class="day-cell">25</md-button>
          <md-button ng-class="calendar.class(26)" ng-show="calendar.isVisible(26)" ng-disabled="calendar.isDisabled(26)" ng-click="calendar.select(26)" type="button" aria-label="26" class="day-cell">26</md-button>
          <md-button ng-class="calendar.class(27)" ng-show="calendar.isVisible(27)" ng-disabled="calendar.isDisabled(27)" ng-click="calendar.select(27)" type="button" aria-label="27" class="day-cell">27</md-button>
          <md-button ng-class="calendar.class(28)" ng-show="calendar.isVisible(28)" ng-disabled="calendar.isDisabled(28)" ng-click="calendar.select(28)" type="button" aria-label="28" class="day-cell">28</md-button>
          <md-button ng-class="calendar.class(29)" ng-show="calendar.isVisible(29)" ng-disabled="calendar.isDisabled(29)" ng-click="calendar.select(29)" type="button" aria-label="29" class="day-cell">29</md-button>
          <md-button ng-class="calendar.class(30)" ng-show="calendar.isVisible(30)" ng-disabled="calendar.isDisabled(30)" ng-click="calendar.select(30)" type="button" aria-label="30" class="day-cell">30</md-button>
          <md-button ng-class="calendar.class(31)" ng-show="calendar.isVisible(31)" ng-disabled="calendar.isDisabled(31)" ng-click="calendar.select(31)" type="button" aria-label="31" class="day-cell">31</md-button>
        </div>
      </div>
      <md-button ng-click="modeSwitch()" aria-label="{{modeSwitchText()}}" type="button" class="switch-control"><i class="fa fa-clock-o"></i><i class="fa fa-calendar"></i><span class="visuallyhidden">{{modeSwitchText()}}</span></md-button>
      <div class="time-control">
        <div class="time-inputs">
          <input type="number" min="{{_hours24 ? 0 : 1}}" max="{{_hours24 ? 23 : 12}}" ng-model="clock._hours"/>
          <md-button ng-click="clock._incHours(1)" aria-label="{{:: translations.incrementHours}}" type="button" class="hours up"><i class="fa fa-caret-up"></i></md-button>
          <md-button ng-click="clock._incHours(-1)" aria-label="{{:: translations.decrementHours}}" type="button" class="hours down"><i class="fa fa-caret-down"></i></md-button>
          <input type="number" min="0" max="59" ng-model="clock._minutes"/>
          <md-button ng-click="clock._incMinutes(1)" aria-label="{{:: translations.incrementMinutes}}" type="button" class="minutes up"><i class="fa fa-caret-up"></i></md-button>
          <md-button ng-click="clock._incMinutes(-1)" aria-label="{{:: translations.decrementMinutes}}" type="button" class="minutes down"><i class="fa fa-caret-down"></i></md-button>
        </div>
        <div ng-if="!_hours24" class="buttons">
          <md-button ng-click="clock.setAM()" aria-label="{{:: translations.switchAmPm}}" type="button">{{date | date:'a'}}</md-button>
        </div>
      </div>
    </div>
  </div>
  <div class="buttons">
    <md-button ng-click="setNow()" aria-label="{{:: translations.now}}" type="button">{{:: translations.now}}</md-button>
    <md-button ng-click="cancel()" ng-if="!autosave" aria-label="{{:: translations.cancel}}" type="button">{{:: translations.cancel}}</md-button>
    <md-button ng-click="save()" ng-if="!autosave" aria-label="{{:: translations.save}}" type="button">{{:: translations.save}}</md-button>
  </div>
</div>