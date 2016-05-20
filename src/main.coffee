angular.module('scDateTime', [])
.value('scDateTimeConfig',
	defaultTheme: 'material'
	autosave: false
	defaultMode: 'date'
	defaultDate: undefined # should be date object!!
	displayMode: undefined
	defaultOrientation: false
	displayTwentyfour: false
	compact: false
).value('scDateTimeI18n',
	previousMonth: "Previous Month"
	nextMonth: "Next Month"
	incrementHours: "Increment Hours"
	decrementHours: "Decrement Hours"
	incrementMinutes: "Increment Minutes"
	decrementMinutes: "Decrement Minutes"
	switchAmPm: "Switch AM/PM"
	now: "Now"
	cancel: "Cancel"
	save: "Save"
	weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
	switchTo: 'Switch to'
	clock: 'Clock'
	calendar: 'Calendar'
).directive 'timeDatePicker', ['$filter', '$sce', '$rootScope', '$parse', 'scDateTimeI18n', 'scDateTimeConfig',
($filter, $sce, $rootScope, $parse, scDateTimeI18n, scDateTimeConfig) ->
	_dateFilter = $filter 'date'
	restrict: 'AE'
	replace: true
	scope:
		_weekdays: '=?tdWeekdays'
	require: 'ngModel'
	templateUrl: (tElement, tAttrs) ->
		if not tAttrs.theme? or tAttrs.theme is '' then tAttrs.theme = scDateTimeConfig.defaultTheme
		return if tAttrs.theme.indexOf('/') <= 0 then "scDateTime-#{tAttrs.theme}.tpl" else tAttrs.theme
	link: (scope, element, attrs, ngModel) ->
		attrs.$observe 'defaultMode', (val) ->
			if val isnt 'time' and val isnt 'date' then val = scDateTimeConfig.defaultMode
			scope._mode = val
		attrs.$observe 'defaultDate', (val) ->
			scope._defaultDate = if val? and Date.parse val then Date.parse val
			else scDateTimeConfig.defaultDate
		attrs.$observe 'displayMode', (val) ->
			if val isnt 'full' and val isnt 'time' and val isnt 'date' then val = scDateTimeConfig.displayMode
			scope._displayMode = val
		attrs.$observe 'orientation', (val) ->
			scope._verticalMode = if val? then val is 'true' else scDateTimeConfig.defaultOrientation
		attrs.$observe 'compact', (val) ->
			scope._compact = if val? then val is 'true' else scDateTimeConfig.compact
		attrs.$observe 'displayTwentyfour', (val) ->
			scope._hours24 = if val? then val else scDateTimeConfig.displayTwentyfour
		attrs.$observe 'mindate', (val) ->
			if val? and Date.parse val
				scope.restrictions.mindate = new Date val
				scope.restrictions.mindate.setHours 0, 0, 0, 0
		attrs.$observe 'maxdate', (val) ->
			if val? and Date.parse val
				scope.restrictions.maxdate = new Date val
				scope.restrictions.maxdate.setHours 23, 59, 59, 999
		scope._weekdays = scope._weekdays or scDateTimeI18n.weekdays
		scope.$watch '_weekdays', (value) ->
			if not value? or not angular.isArray value
				scope._weekdays = scDateTimeI18n.weekdays

		ngModel.$render = -> scope.setDate ngModel.$modelValue ? scope._defaultDate, ngModel.$modelValue?

		# Select contents of inputs when foccussed into
		angular.forEach element.find('input'),
			(input) ->
				angular.element(input).on 'focus', ->
					setTimeout (-> input.select()), 10

		scope.autosave = false
		if attrs['autosave']? or scDateTimeConfig.autosave
			scope.saveUpdateDate = () -> ngModel.$setViewValue scope.date
			scope.autosave = true
		else
			saveFn = $parse attrs.onSave
			cancelFn = $parse attrs.onCancel
			scope.saveUpdateDate = () -> true

			scope.save = ->
				ngModel.$setViewValue new Date scope.date
				saveFn scope.$parent, $value: new Date scope.date
			scope.cancel = ->
				cancelFn scope.$parent, {}
				ngModel.$render()
	controller: ['$scope', 'scDateTimeI18n', (scope, scDateTimeI18n) ->
		scope._defaultDate = scDateTimeConfig.defaultDate
		scope._mode = scDateTimeConfig.defaultMode
		scope._displayMode = scDateTimeConfig.displayMode
		scope._verticalMode = scDateTimeConfig.defaultOrientation
		scope._hours24 = scDateTimeConfig.displayTwentyfour
		scope._compact = scDateTimeConfig.compact
		scope.translations = scDateTimeI18n
		scope.restrictions =
			mindate: undefined
			maxdate: undefined
			
		scope.addZero = (min) -> if min > 9 then min.toString() else ("0"+min).slice(-2)
		scope.setDate = (newVal, save=true) ->
			scope.date = if newVal then new Date newVal else new Date()
			scope.calendar._year = scope.date.getFullYear()
			scope.calendar._month = scope.date.getMonth()
			scope.clock._minutes = scope.addZero scope.date.getMinutes()
			scope.clock._hours = if scope._hours24 then scope.date.getHours() else scope.date.getHours() % 12
			if not scope._hours24 and scope.clock._hours is 0 then scope.clock._hours = 12
			scope.calendar.yearChange save
		scope.display =
			fullTitle: ->
				_timeString = if scope._hours24 then 'HH:mm' else 'h:mm a'
				if scope._displayMode is 'full' and not scope._verticalMode
					_dateFilter scope.date, "EEEE d MMMM yyyy, #{_timeString}"
				else if scope._displayMode is 'time' then _dateFilter scope.date, _timeString
				else if scope._displayMode is 'date' then _dateFilter scope.date, 'EEE d MMM yyyy'
				else _dateFilter scope.date, "d MMM yyyy, #{_timeString}"
			title: ->
				if scope._mode is 'date'
					_dateFilter scope.date, (if scope._displayMode is 'date' then 'EEEE' else "EEEE #{
						if scope._hours24 then 'HH:mm' else 'h:mm a'
					}")
				else _dateFilter scope.date, 'MMMM d yyyy'
			super: ->
				if scope._mode is 'date' then _dateFilter scope.date, 'MMM'
				else ''
			main: -> $sce.trustAsHtml(
				if scope._mode is 'date' then _dateFilter scope.date, 'd'
				else
					if scope._hours24 then _dateFilter scope.date, 'HH:mm'
					else "#{_dateFilter scope.date, 'h:mm'}<small>#{_dateFilter scope.date, 'a'}</small>"
			)
			sub: ->
				if scope._mode is 'date' then _dateFilter scope.date, 'yyyy'
				else _dateFilter scope.date, 'HH:mm'

		scope.calendar =
			_month: 0
			_year: 0
			_months: []
			_allMonths: (_dateFilter new Date(0, i), 'MMMM' for i in [0..11])
			offsetMargin: -> "#{new Date(@_year, @_month).getDay() * 2.7}rem"
			isVisible: (d) -> new Date(@_year, @_month, d).getMonth() is @_month
			isDisabled: (d) ->
				currentDate = new Date(@_year, @_month, d)
				mindate = scope.restrictions.mindate
				maxdate = scope.restrictions.maxdate
				(mindate? and currentDate < mindate) or (maxdate? and currentDate > maxdate)
			isPrevMonthButtonHidden: () ->
				date = scope.restrictions["mindate"]
				date? and @_month <= date.getMonth() and @_year <= date.getFullYear()
			isNextMonthButtonHidden: () ->
				date = scope.restrictions["maxdate"]
				date? and @_month >= date.getMonth() and @_year >= date.getFullYear()
			class: (d) ->
				classString = ''
				# coffeelint: disable=max_line_length
				if scope.date? and new Date(@_year, @_month, d).getTime() is new Date(scope.date.getTime()).setHours(0,
					0, 0, 0)
					classString += "selected"
				if new Date(@_year, @_month, d).getTime() is new Date().setHours(0, 0, 0, 0)
					classString += " today"
				classString
# coffeelint: enable=max_line_length
			select: (d) ->
				scope.date.setFullYear @_year, @_month, d
				scope.saveUpdateDate()
			monthChange: (save=true) ->
				if not @_year? or isNaN @_year then @_year = new Date().getFullYear()
				mindate = scope.restrictions.mindate
				maxdate = scope.restrictions.maxdate
				if mindate? and mindate.getFullYear() is @_year and mindate.getMonth() >= @_month
					@_month = Math.max mindate.getMonth(), @_month
				if maxdate? and maxdate.getFullYear() is @_year and maxdate.getMonth() <= @_month
					@_month = Math.min maxdate.getMonth(), @_month
				scope.date.setFullYear @_year, @_month
				if scope.date.getMonth() isnt @_month then scope.date.setDate 0
				if mindate? and scope.date < mindate
					scope.date.setDate mindate.getTime()
					scope.calendar.select mindate.getDate()
				if maxdate? and scope.date > maxdate
					scope.date.setDate maxdate.getTime()
					scope.calendar.select maxdate.getDate()
				if save then scope.saveUpdateDate()
			_incMonth: (months) ->
				@_month += months
				while @_month < 0 or @_month > 11
					if @_month < 0
						@_month += 12
						@_year--
					else
						@_month -= 12
						@_year++
				@monthChange()
			yearChange: (save=true) ->
				if not scope.calendar._year? or scope.calendar._year is '' then return
				mindate = scope.restrictions.mindate
				maxdate = scope.restrictions.maxdate
				i = if mindate? and mindate.getFullYear() is scope.calendar._year then mindate.getMonth() else 0
				len = if maxdate? and maxdate.getFullYear() is scope.calendar._year then maxdate.getMonth() else 11
				scope.calendar._months = scope.calendar._allMonths.slice i, len + 1
				scope.calendar.monthChange save
		scope.clock =
			_minutes: '00'
			_hours: 0
			_incHours: (inc) ->
				@_hours = if scope._hours24
				then Math.max 0, Math.min 23, @_hours + inc
				else Math.max 1, Math.min 12, @_hours + inc
				if isNaN @_hours then @_hours = 0
			_incMinutes: (inc) ->
				@_minutes = scope.addZero(Math.max 0, Math.min 59, parseInt(@_minutes) + inc).toString()
			setAM: (b = not @isAM()) ->
				if b and not @isAM()
					scope.date.setHours(scope.date.getHours() - 12)
				else if not b and @isAM()
					scope.date.setHours(scope.date.getHours() + 12)
				scope.saveUpdateDate()
			isAM: -> scope.date.getHours() < 12
		scope.$watch 'clock._minutes', (val, oldVal) ->
			return unless val
			
			intMin = parseInt val
			if not isNaN(intMin) and 0 <= intMin <= 59 and intMin isnt scope.date.getMinutes()
				scope.date.setMinutes intMin
				scope.saveUpdateDate()
		scope.$watch 'clock._hours', (val) ->
			if val? and not isNaN(val)
				if not scope._hours24
					if val is 24 then val = 12
					else if val is 12 then val = 0
					else if not scope.clock.isAM() then val += 12
				if val isnt scope.date.getHours()
					scope.date.setHours val
					scope.saveUpdateDate()

		scope.setNow = ->
			scope.setDate()
			scope.saveUpdateDate()
		scope.modeClass = ->
			if scope._displayMode? then scope._mode = scope._displayMode
			"#{if scope._verticalMode then 'vertical ' else ''}#{
			if scope._displayMode is 'full' then 'full-mode'
			else if scope._displayMode is 'time' then 'time-only'
			else if scope._displayMode is 'date' then 'date-only'
			else if scope._mode is 'date' then 'date-mode'
			else 'time-mode'} #{if scope._compact then 'compact' else ''}"
		scope.modeSwitch = -> scope._mode = scope._displayMode ? if scope._mode is 'date' then 'time' else 'date'
		scope.modeSwitchText = -> scDateTimeI18n.switchTo + ' ' +
			if scope._mode is 'date' then scDateTimeI18n.clock else scDateTimeI18n.calendar
	]]
