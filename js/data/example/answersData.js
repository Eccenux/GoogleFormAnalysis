/**
	Creating this file:
	1. Save results to CSV

	2. Add array around rows (var answersData = [...rows...];)

	3. Auto replace (search, replace):
	// new line to escaped new line
	([^"\r\n])\n
	$1\\\n
	// row -> array
	\n("[\s\S]+?")(?=\n)
	\n,[$1]
	// quote escaping
	([^,"])""
	$1\\"
	
	4. Any JS formatting errors must be changed (check for errors in JS console or Netbeans).
*/
var answersData = [
 ["Sygnatura czasowa","Skąd dowiedziałeś(-aś) się o tej ankiecie","Płeć","Wiek","Gdzie mieszkasz","W ilu masach brałeś(-aś) udział?","Jaki Twoim zdaniem jest (obecnie) główny cel lub cele Masy Krytycznej w Gdyni?","Jakie Twoim zdaniem powinny być główne cele Masy Krytycznej?","Jeśli nie ma Cię na masie, to dlaczego? [Zapomniałem(-am), nie wiedziałem(-am).]","Jeśli nie ma Cię na masie, to dlaczego? [Nie mam czasu.]","Jeśli nie ma Cię na masie, to dlaczego? [Siła wyższa (zepsuty rower, choroba itp).]","Jeśli nie ma Cię na masie, to dlaczego? [Trasa jest dla mnie za długa (lub za trudna).]","Jeśli nie ma Cię na masie, to dlaczego? [Nie lubię imprez publicznych (niekoniecznie rowerowych).]","Jeśli nie ma Cię na masie, to dlaczego? [Nie lubię imprez rowerowych.]","Jeśli nie ma Cię na masie, to dlaczego? [Boję się jeździć po ulicy.]","Jeśli nie ma Cię na masie, to dlaczego? [Nie chcę być kojarzony(-a) z Masą Krytyczną.]","Jeśli nie ma Cię na masie, to dlaczego? [Nie zgadzam się z postulatami.]","Jeśli nie ma Cię na masie, to dlaczego? [Nie wierzę, że mój udział coś zmieni.]","Jeśli nie ma Cię na masie, to dlaczego? [Nie zgadzam się z tą formą.]","Inny powód lub powody","Która masa krytyczna podobała Ci się najbardziej?","Dlaczego ta masa była najciekawsza, najfajniejsza lub najistotniejsza?","Inne uwagi na temat naszych mas krytycznych","Co według Ciebie zrobić, żeby zwiększyć liczebność Mas Krytycznych","Skąd dowiedziałeś(-aś) się o masie?"]
,["2013/07/26 0:00:00 PM EET","z github :-)","mężczyzna","35-40","Małe Trójmiasto","2-5","Protest przeciwko złej jakości dróg rowerowych itp.;Promowanie ruchu rowerowego jako środka codziennego transportu.","Manifestacja obecności rowerów na drogach.;Promowanie ruchu rowerowego jako środka codziennego transportu.","nie, nie dlatego","raczej tak","nie, nie dlatego","raczej nie","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","","","","Trasy powinny być wytyczane po głównych drogach i w centrum","nie wiem, ale ankieta, to dobry pomysł :-)","od znajomych;z Facebooka"]
,["2013/07/26 1:00:00 PM EET","z github :-)","odmowa odpowiedzi","13-17","Gdynia","2-5","Protest przeciwko złej jakości dróg rowerowych itp.;Protest przeciwko złym rozwiązaniom w prawie lokalnym.;Protest przeciwko złym rozwiązaniom w prawie krajowym.;Manifestacja obecności rowerów na drogach.;Promowanie ruchu rowerowego jako środka codziennego transportu.","Protest przeciwko jakości dróg rowerowych itp.;Protest przeciwko złym rozwiązaniom w prawie lokalnym.;Protest przeciwko złym rozwiązaniom w prawie krajowym.;Promowanie turystycznego ruchu rowerowego.","nie, nie dlatego","tak, to główny powód","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","","","","","informacja kiedy i z jakiego powodu jest masa","ze strony SRG"]
,["2013/07/27 2:00:00 PM EET","z github :-)","mężczyzna","41-50","Gdynia","2-5","Protest przeciwko złej jakości dróg rowerowych itp.;Manifestacja obecności rowerów na drogach.;Promowanie ruchu rowerowego jako środka codziennego transportu.","Protest przeciwko jakości dróg rowerowych itp.;Manifestacja obecności rowerów na drogach.;Promowanie ruchu rowerowego jako środka codziennego transportu.","nie, nie dlatego","tak, to główny powód","tak, to główny powód","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","","","","","","od znajomych"]
,["2013/07/29 3:00:00 AM EET","z github :-)","kobieta","25-34","Gdańsk","żadnej","Protest przeciwko złej jakości dróg rowerowych itp.;Manifestacja obecności rowerów na drogach.;Promowanie ruchu rowerowego jako środka codziennego transportu.","Protest przeciwko jakości dróg rowerowych itp.;Manifestacja obecności rowerów na drogach.;Promowanie ruchu rowerowego jako środka codziennego transportu.","raczej nie","raczej tak","raczej nie","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","raczej nie","nie, nie dlatego","","","","","","nie pamiętam"]
,["2013/08/01 4:00:00 AM EET","z Facebooka","kobieta","35-40","Gdynia","żadnej","Manifestacja obecności rowerów na drogach.","Protest przeciwko jakości dróg rowerowych itp.;Manifestacja obecności rowerów na drogach.;Promowanie ruchu rowerowego jako środka codziennego transportu.","nie, nie dlatego","raczej nie","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","nie, nie dlatego","z lenistwa","","","","","od znajomych"]
];
