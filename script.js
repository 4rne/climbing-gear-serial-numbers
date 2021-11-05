function setup() {
  input = document.getElementById('input')
  outputDate = document.getElementById('output_date')
  outputNote = document.getElementById('output_note')
  userLang = navigator.language || navigator.userLanguage || 'de-DE'; 
  
  patterns = [
    [/^(?<year_dual>\d{2})(?<month_letter>[A-L])\d{10}/, 'Petzl current'],
    [/^(?<year_dual>\d{2})(?<day_of_year>\d{3})[A-Z]{2}\d{4}/, 'Petzl old'],
    [/^(?<year_dual>\d{2})(?<day_of_year>\d{3})\d{4}[ABMC]/, 'DMM'],
  ]
  input.addEventListener('input', parse);
  parse()
}

function parse() {
  for(let pattern of patterns) {
    match = input.value.trim().toUpperCase().match(pattern[0])
    if(match != null) {
      date = createDate(match.groups)
      manufacturer = pattern[1]
      outputDate.innerHTML = "Manufacturing date: <br /><strong>" +
        date.toLocaleDateString(userLang) + "</strong><br /><strong>" +
        date.toISOString().slice(0, 10) + "</strong>"
      outputNote.innerHTML = "Serial number style: <br /><strong>" + manufacturer + "</strong>"
      console.log(date)
      console.log(manufacturer)
      return;
    } else {
    outputDate.innerHTML = ""
    outputNote.innerHTML = ""
    }
  };
}

function createDate(groups) {
  year = parseYear(groups)
  month = parseMonth(groups)
  day = parseDay(groups)

  if(month === undefined && day) {
    return new Date(year, 0, day)
  } else if (month && day === undefined) {
    return new Date(year, month, 1)
  } else {
    return new Date(year, month, day)
  }
}

function parseYear(groups) {
  let year = 1970;
  if(groups['year_dual'] != null) {
    if(groups['year_dual'] <= 70) {
      year = '20' + groups['year_dual']
    } else {
      year = '19' + groups['year_dual']
    }
  } else if(groups['year_full'] != null) {
    year = groups['year_dual']
  }
  return year;
}

function parseMonth(groups) {
  if(groups['month'] != null) {
    return groups['month']
  } else if(groups['month_letter'] != null) {
    return groups['month_letter'].toUpperCase().charCodeAt(0) - 64
  }
}

function parseDay(groups) {
  if(groups['day_of_year'] != null) {
    return groups['day_of_year']
  }
}
