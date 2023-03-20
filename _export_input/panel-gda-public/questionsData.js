/**
	Pytania (tylko użyte):
	* [select-one] jednokrotny wybór = wybierz z listy
	* [select-many] wielokrotny wybór
	* [grid] siatka
	* [text] tekst = tekst akapitu
*/
var questionsData =
[
	{
		title:"Sygnatura czasowa"
		, displayTitle:"Liczba odpowiedzi dziennych"
		, type: 'date'
	},
	{
		title:"Dzielnica"
		, type: 'select-one'
		, other: true
		, options:
			["Anio\u0142ki","Br\u0119towo","Brze\u017ano","Che\u0142m","Jasie\u0144","Kokoszki","Krakowiec - G\u00f3rki Zachodnie","Letnica","Matarnia","M\u0142yniska","Nowy Port","Oliwa","Olszynka","Orunia - \u015aw.Wojciech - Lipce","Osowa","Piecki - Migowo","Przer\u00f3bka","Przymorze Ma\u0142e","Przymorze Wielkie","Rudniki","Siedlce","\u015ar\u00f3dmie\u015bcie","Stogi","Strzy\u017ca","Suchanino","Uje\u015bcisko-\u0141ostowice","VII Dw\u00f3r","Wrzeszcz Dolny","Wrzeszcz G\u00f3rny","Wyspa Sobieszewska","Wzg\u00f3rze Mickiewicza","\u017babianka - Wejhera - Jelitkowo - Tysi\u0105clecia","Zaspa M\u0142yniec","Zaspa Rozstaje"]
	},
	{
		title:"Płeć"
		, type: 'select-one'
		, other: false
		, options:
		["kobieta"
		,"mężczyzna"]
	},
	{
		title:"Wiek"
		, type: 'select-one'
		, other: false
		, options:
		["16-24"
		,"25-39"
		,"40-64"
		,"więcej niż 65 lat"]
	},
	{
		title:"Wykształcenie"
		, type: 'select-one'
		, other: false
		, options:
		["podstawowe"
		,"średnie"
		,"wyższe"]
	},
	{
		title:"Dzieci"
		, type: 'select-one'
		, other: false
		, options:
		["mam"
		,"nie mam"]
	}
];
