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
		title:"Skąd dowiedziałeś(-aś) się o tej ankiecie"
		, type: 'select-one'
		, other: true
		, options:
			["z lipcowej masy"
			,"z sierpniowej masy"
			,"z Facebooka"
			,"ze strony SRG"
			,"z plakatu"
			,"od znajomych"
			,"odmowa odpowiedzi"]
	},
	{
		title:"Płeć"
		, type: 'select-one'
		, other: false
		, options:
		["kobieta"
		,"mężczyzna"
		,"odmowa odpowiedzi"]
	},
	{
		title:"Wiek"
		, type: 'select-one'
		, other: false
		, options:
		["mniej niż 6 lat"
		,"6-12"
		,"13-17"
		,"18-24"
		,"25-34"
		,"35-40"
		,"41-50"
		,"51-60"
		,"61-70"
		,"71-80"
		,"81-90"
		,"więcej niż 90 lat"
		,"odmowa odpowiedzi"]
	},
	{
		title:"Gdzie mieszkasz"
		, type: 'select-one'
		, other: true
		, options:
		["Gdynia"
		,"Sopot"
		,"Gdańsk"
		,"Małe Trójmiasto"]
	},
	{
		title:"W ilu masach brałeś(-aś) udział?"
		, type: 'select-one'
		, other: false
		, options:
		["żadnej"
		,"jednej"
		,"2-5"
		,"6-10"
		,"więcej niż 10"
		,"nie pamiętam"]
	},
	{
		title:"Jaki Twoim zdaniem jest (obecnie) główny cel lub cele Masy Krytycznej w Gdyni?"
		, type: 'select-many'
		, other: false
		, options:
		["Protest przeciwko złej jakości dróg rowerowych itp."
		,"Protest przeciwko złym rozwiązaniom w prawie lokalnym."
		,"Protest przeciwko złym rozwiązaniom w prawie krajowym."
		,"Manifestacja obecności rowerów na drogach."
		,"Promowanie turystycznego ruchu rowerowego."
		,"Promowanie ruchu rowerowego jako środka codziennego transportu."
		,"Parada rowerowa."
		,"Akcje charytatywne/tematyczne."]
	},
	{
		title:"Jakie Twoim zdaniem powinny być główne cele Masy Krytycznej?"
		, type: 'select-many'
		, other: true
		, options:
		["Protest przeciwko jakości dróg rowerowych itp."
		,"Protest przeciwko złym rozwiązaniom w prawie lokalnym."
		,"Protest przeciwko złym rozwiązaniom w prawie krajowym."
		,"Manifestacja obecności rowerów na drogach."
		,"Promowanie turystycznego ruchu rowerowego."
		,"Promowanie ruchu rowerowego jako środka codziennego transportu."
		,"Parada rowerowa."
		,"Akcje charytatywne/tematyczne."]
	},
	{
		title:"Jeśli nie ma Cię na masie, to dlaczego?"
		, type: 'grid'
		, other: true
		, options:
		["Zapomniałem(-am), nie wiedziałem(-am)."
		,"Nie mam czasu."
		,"Siła wyższa (zepsuty rower, choroba itp)."
		,"Trasa jest dla mnie za długa (lub za trudna)."	
		,"Nie lubię imprez publicznych (niekoniecznie rowerowych)."				
		,"Nie lubię imprez rowerowych."
		,"Boję się jeździć po ulicy."
		,"Nie chcę być kojarzony(-a) z Masą Krytyczną."	
		,"Nie zgadzam się z postulatami."
		,"Nie wierzę, że mój udział coś zmieni."
		,"Nie zgadzam się z tą formą."]
		, scale:
		["tak, to główny powód"
		, "raczej tak"
		, "raczej nie"
		, "nie, nie dlatego"]
	},
	{
		title:"Inny powód lub powody"
		, type: 'text'
	},
	{
		title:"Która masa krytyczna podobała Ci się najbardziej i dlaczego?"
		, type: 'text-merged'
		, titles: [
			"Która masa krytyczna podobała Ci się najbardziej?",
			'Dlaczego ta masa była najciekawsza, najfajniejsza lub najistotniejsza?'
		]
	},
	{
		title:"Inne uwagi na temat naszych mas krytycznych"
		, type: 'text'
	},
	{
		title:"Co według Ciebie zrobić, żeby zwiększyć liczebność Mas Krytycznych"
		, type: 'text'
	},
	{
		title:"Skąd dowiedziałeś(-aś) się o masie?"
		, type: 'select-many'
		, other: true
		, options:
			["od znajomych"
			,"z plakatu albo ulotki"
			,"z Facebooka"
			,"ze strony SRG"
			,"nie pamiętam"]
	},	
];
