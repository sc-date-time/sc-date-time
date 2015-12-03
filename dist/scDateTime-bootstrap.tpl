
<div ng-class="modeClass()" class="time-date">
  <div ng-click="modeSwitch()" class="display">
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
          <button type="button" ng-click="calendar._incMonth(-1)" style="float: left;" ng-class="{'visuallyhidden': calendar.isPrevMonthButtonHidden()}" class="btn btn-link"><i class="fa fa-caret-left"></i></button><span class="month-part">{{date | date:'MMMM'}}
            <select ng-model="calendar._month" ng-change="calendar.monthChange()" ng-options="calendar._allMonths.indexOf(month) as month for month in calendar._months"></select></span>
          <input ng-model="calendar._year" ng-change="calendar.yearChange()" type="number" min="{{restrictions.mindate ? restrictions.mindate.getFullYear() : 0}}" max="{{restrcitions.maxdate ? restrictions.maxdate.getFullYear() : NaN}}" class="year-part"/>
          <button type="button" ng-click="calendar._incMonth(1)" style="float: right;" ng-class="{'visuallyhidden': calendar.isNextMonthButtonHidden()}" class="btn btn-link"><i class="fa fa-caret-right"></i></button>
        </div>
        <div class="headers">
          <div ng-repeat="day in _weekdays track by $index" class="day-cell">{{day}}</div>
        </div>
        <div class="days">
          <button type="button" ng-style="{'margin-left': calendar.offsetMargin()}" ng-class="calendar.class(1)" ng-disabled="calendar.isDisabled(1)" ng-show="calendar.isVisible(1)" ng-click="calendar.select(1)" class="btn btn-link day-cell">1</button>
          <button type="button" ng-class="calendar.class(2)" ng-show="calendar.isVisible(2)" ng-disabled="calendar.isDisabled(2)" ng-click="calendar.select(2)" class="btn btn-link day-cell">2</button>
          <button type="button" ng-class="calendar.class(3)" ng-show="calendar.isVisible(3)" ng-disabled="calendar.isDisabled(3)" ng-click="calendar.select(3)" class="btn btn-link day-cell">3</button>
          <button type="button" ng-class="calendar.class(4)" ng-show="calendar.isVisible(4)" ng-disabled="calendar.isDisabled(4)" ng-click="calendar.select(4)" class="btn btn-link day-cell">4</button>
          <button type="button" ng-class="calendar.class(5)" ng-show="calendar.isVisible(5)" ng-disabled="calendar.isDisabled(5)" ng-click="calendar.select(5)" class="btn btn-link day-cell">5</button>
          <button type="button" ng-class="calendar.class(6)" ng-show="calendar.isVisible(6)" ng-disabled="calendar.isDisabled(6)" ng-click="calendar.select(6)" class="btn btn-link day-cell">6</button>
          <button type="button" ng-class="calendar.class(7)" ng-show="calendar.isVisible(7)" ng-disabled="calendar.isDisabled(7)" ng-click="calendar.select(7)" class="btn btn-link day-cell">7</button>
          <button type="button" ng-class="calendar.class(8)" ng-show="calendar.isVisible(8)" ng-disabled="calendar.isDisabled(8)" ng-click="calendar.select(8)" class="btn btn-link day-cell">8</button>
          <button type="button" ng-class="calendar.class(9)" ng-show="calendar.isVisible(9)" ng-disabled="calendar.isDisabled(9)" ng-click="calendar.select(9)" class="btn btn-link day-cell">9</button>
          <button type="button" ng-class="calendar.class(10)" ng-show="calendar.isVisible(10)" ng-disabled="calendar.isDisabled(10)" ng-click="calendar.select(10)" class="btn btn-link day-cell">10</button>
          <button type="button" ng-class="calendar.class(11)" ng-show="calendar.isVisible(11)" ng-disabled="calendar.isDisabled(11)" ng-click="calendar.select(11)" class="btn btn-link day-cell">11</button>
          <button type="button" ng-class="calendar.class(12)" ng-show="calendar.isVisible(12)" ng-disabled="calendar.isDisabled(12)" ng-click="calendar.select(12)" class="btn btn-link day-cell">12</button>
          <button type="button" ng-class="calendar.class(13)" ng-show="calendar.isVisible(13)" ng-disabled="calendar.isDisabled(13)" ng-click="calendar.select(13)" class="btn btn-link day-cell">13</button>
          <button type="button" ng-class="calendar.class(14)" ng-show="calendar.isVisible(14)" ng-disabled="calendar.isDisabled(14)" ng-click="calendar.select(14)" class="btn btn-link day-cell">14</button>
          <button type="button" ng-class="calendar.class(15)" ng-show="calendar.isVisible(15)" ng-disabled="calendar.isDisabled(15)" ng-click="calendar.select(15)" class="btn btn-link day-cell">15</button>
          <button type="button" ng-class="calendar.class(16)" ng-show="calendar.isVisible(16)" ng-disabled="calendar.isDisabled(16)" ng-click="calendar.select(16)" class="btn btn-link day-cell">16</button>
          <button type="button" ng-class="calendar.class(17)" ng-show="calendar.isVisible(17)" ng-disabled="calendar.isDisabled(17)" ng-click="calendar.select(17)" class="btn btn-link day-cell">17</button>
          <button type="button" ng-class="calendar.class(18)" ng-show="calendar.isVisible(18)" ng-disabled="calendar.isDisabled(18)" ng-click="calendar.select(18)" class="btn btn-link day-cell">18</button>
          <button type="button" ng-class="calendar.class(19)" ng-show="calendar.isVisible(19)" ng-disabled="calendar.isDisabled(19)" ng-click="calendar.select(19)" class="btn btn-link day-cell">19</button>
          <button type="button" ng-class="calendar.class(20)" ng-show="calendar.isVisible(20)" ng-disabled="calendar.isDisabled(20)" ng-click="calendar.select(20)" class="btn btn-link day-cell">20</button>
          <button type="button" ng-class="calendar.class(21)" ng-show="calendar.isVisible(21)" ng-disabled="calendar.isDisabled(21)" ng-click="calendar.select(21)" class="btn btn-link day-cell">21</button>
          <button type="button" ng-class="calendar.class(22)" ng-show="calendar.isVisible(22)" ng-disabled="calendar.isDisabled(22)" ng-click="calendar.select(22)" class="btn btn-link day-cell">22</button>
          <button type="button" ng-class="calendar.class(23)" ng-show="calendar.isVisible(23)" ng-disabled="calendar.isDisabled(23)" ng-click="calendar.select(23)" class="btn btn-link day-cell">23</button>
          <button type="button" ng-class="calendar.class(24)" ng-show="calendar.isVisible(24)" ng-disabled="calendar.isDisabled(24)" ng-click="calendar.select(24)" class="btn btn-link day-cell">24</button>
          <button type="button" ng-class="calendar.class(25)" ng-show="calendar.isVisible(25)" ng-disabled="calendar.isDisabled(25)" ng-click="calendar.select(25)" class="btn btn-link day-cell">25</button>
          <button type="button" ng-class="calendar.class(26)" ng-show="calendar.isVisible(26)" ng-disabled="calendar.isDisabled(26)" ng-click="calendar.select(26)" class="btn btn-link day-cell">26</button>
          <button type="button" ng-class="calendar.class(27)" ng-show="calendar.isVisible(27)" ng-disabled="calendar.isDisabled(27)" ng-click="calendar.select(27)" class="btn btn-link day-cell">27</button>
          <button type="button" ng-class="calendar.class(28)" ng-show="calendar.isVisible(28)" ng-disabled="calendar.isDisabled(28)" ng-click="calendar.select(28)" class="btn btn-link day-cell">28</button>
          <button type="button" ng-class="calendar.class(29)" ng-show="calendar.isVisible(29)" ng-disabled="calendar.isDisabled(29)" ng-click="calendar.select(29)" class="btn btn-link day-cell">29</button>
          <button type="button" ng-class="calendar.class(30)" ng-show="calendar.isVisible(30)" ng-disabled="calendar.isDisabled(30)" ng-click="calendar.select(30)" class="btn btn-link day-cell">30</button>
          <button type="button" ng-class="calendar.class(31)" ng-show="calendar.isVisible(31)" ng-disabled="calendar.isDisabled(31)" ng-click="calendar.select(31)" class="btn btn-link day-cell">31</button>
        </div>
      </div>
      <button type="button" ng-click="modeSwitch()" class="btn btn-link switch-control"><i class="fa fa-clock-o"></i><i class="fa fa-calendar"></i><span class="visuallyhidden">{{modeSwitchText()}}</span></button>
      <div class="time-control">
        <div class="time-inputs">
          <input type="number" min="{{_hours24 ? 0 : 1}}" max="{{_hours24 ? 23 : 12}}" ng-model="clock._hours"/>
          <button type="button" ng-click="clock._incHours(1)" class="btn btn-link hours up"><i class="fa fa-caret-up"></i></button>
          <button type="button" ng-click="clock._incHours(-1)" class="btn btn-link hours down"><i class="fa fa-caret-down"></i></button>
          <input type="number" min="0" max="59" ng-model="clock._minutes"/>
          <button type="button" ng-click="clock._incMinutes(1)" class="btn btn-link minutes up"><i class="fa fa-caret-up"></i></button>
          <button type="button" ng-click="clock._incMinutes(-1)" class="btn btn-link minutes down"><i class="fa fa-caret-down"></i></button>
        </div>
        <div ng-if="!_hours24" class="buttons">
          <button type="button" ng-click="clock.setAM()" class="btn btn-link">{{date | date:'a'}}</button>
        </div>
      </div>
    </div>
  </div>
  <div class="buttons">
    <button type="button" ng-click="setNow()" class="btn btn-link">{{:: translations.now}}</button>
    <button type="button" ng-click="cancel()" ng-if="!autosave" class="btn btn-link">{{:: translations.cancel}}</button>
    <button type="button" ng-click="save()" ng-if="!autosave" class="btn btn-link">{{:: translations.save}}</button>
  </div>
</div>