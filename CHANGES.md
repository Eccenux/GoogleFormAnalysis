Changes and supported features.

## Basic model (questions)

* Basic data model.
* (Ewa) Check model with original summary.

## Data (answers) parsing

* Get CSV of answers, transform to JS array.
* Parsing questions data to model.
* Parsing answers data to model.
* More accurate parsing of headers and answers.
* Reformatting - whole row treated as a single answer (need answer cells grouped for filtering purposes).
* Parsing select-many values.
* Validation of answers (check if the value if allowed within question type and options).

## Basic, visual summary (without charts).

* Building summary in JS.
* Build and output HTML for headers and legend-like list.
* Basic CSS formatting.

## Data merging and filtering.

* Merge two text questions ('text-merge' question type with `titles` property as an array of actual titles).
* Answer row (single person answers) filtering based on values in that row.
* Question filtering (skip whole question in the summary).
* Allow specifying named filter sets for the survey
* Easy question filtering, ordering and grouping.
* Easy answer filtering (keep and skip).
* Filters GUI - choose one of named filter sets and re-render summary.

## Final rendering

* Search for a nice chart library.
* Drawing pie charts (select-one, select-many).
* Drawing bar chart for select-many.
* Drawing charts in grids (bi-color, without legend).
* Drawing date (time-line) chart.
* Allow specifying alternative title (`displayTitle`) for questions.

## Export

1. Some cleanup and fixes.
2. Move chart rendering to separate script.
3. Export class to prepare summary for all filterSets and render HTML for each one.
4. Node.js script for saving export data to a file.
5. Add new controller for public export and prepare index.
6. Node.js script for creating public export folder (must fail when output folder already exists).
