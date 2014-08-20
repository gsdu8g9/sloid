//Avtor Luka Pušić, <luka@pusic.si>
$.get('./data/imena_m_top250.txt', function(data) {
	window.imena_m = data.split('\n');
},'html');
$.get('./data/imena_z_top250.txt', function(data) {
	window.imena_z = data.split('\n');
},'html');
$.get('./data/priimki_top200.txt', function(data) {
	window.priimki = data.split('\n');
},'html');
//Iz zbirke ~40K naslovov iz DURS razdeljenih po datotekah s po 500 vrsticami izberi naključno
x = Math.floor(Math.random()*84).toString();

$.get('./data/naslovi/naslovi_durs'+x, function(data) {	
	window.naslovi = data.split('\n');	
},'html');

function fake_id(){

	var emso_datum;
	spola = ['Moški', 'Ženski'];
	spol = Math.floor(Math.random()*2); // 0 je moški, 1 je ženski

	function gen_telefonska(){
		ponudniki = ['040', '041', '070', '051', '031'];
		ponudnik = ponudniki[Math.floor(Math.random()*ponudniki.length)];
		
		telefonska = ponudnik.toString()+' ';
		for(var i=0;i<6;i++){
			if(i==3){telefonska += ' '};
			telefonska += Math.floor(Math.random()*10).toString();
		}
		return telefonska;
	}
	
	function gen_ime(spol){
		priimek = window.priimki[Math.floor(Math.random()*window.priimki.length)];
		
		if(spol){
			return window.imena_z[Math.floor(Math.random()*imena_z.length)] + ' ' + priimek;
		} else {
			return window.imena_m[Math.floor(Math.random()*imena_m.length)] + ' ' + priimek;
		}

	}
	
	function gen_datum(){
		danes = new Date(); //današnji datum, objekt
		datum_do = danes.getTime() - 567648000000; //najmanjša starost je 18 let (567648000000 mikrosekund je 18 let)
		datum_od = datum_do - 1640960000000; // najstarejša starost naj bo 70 let, torej (dotum_do - 52 let)
		datum = new Date(datum_od + Math.random() * (datum_do - datum_od)); //najključni datum med datum_od in datum_do
		starost = danes.getFullYear() - datum.getFullYear(); //izračunaj starost iz datuma
		if(datum.getDate()<10){dan = '0'+(datum.getDate()+1).toString();}else{dan = (datum.getDate()).toString();} // spredi 0
		if(datum.getMonth()<10){mesec = '0'+(datum.getMonth()+1).toString();}else{mesec = (datum.getMonth()+1).toString();} // spredi 0
		emso_datum = dan + mesec + datum.getFullYear().toString().substring(1);
		return dan + '.' + mesec + '.' + datum.getFullYear().toString() + ' (' + starost + ' let)'; //slovenski format datuma d.m.Y
	}
	
	function gen_emso(){
		// algoritem na http://sl.wikipedia.org/wiki/Enotna_mati%C4%8Dna_%C5%A1tevilka_ob%C4%8Dana
		if(spol){z = '5';}else{z = '0';}
		zz =  + Math.floor(Math.random() * 100).toString(); //predvidevam, da se ne rodi več kot 100 otrok istega spola na dan
		if(zz<10){zz='0'+zz;} //spredi 0
		prvih_dvanajst = (emso_datum + '50' + z + zz).split('');
		ponderji = [7,6,5,4,3,2,7,6,5,4,3,2];
		kontrolna = 0;
		for(var i=0;i<ponderji.length;i++){
			kontrolna += ponderji[i] * prvih_dvanajst[i];
		}
		kontrolna = 11 - kontrolna % 11;
		if(kontrolna == 10){return gen_emso();} //ponovi postopek, ker se ta emšo izloči
		if(kontrolna == 11){kontrolna = 0;} //tako je pravilo
		return prvih_dvanajst.join('') + kontrolna.toString();
	}

	function gen_davcna(){
		//algoritem na http://www.durs.gov.si/si/storitve/vpis_v_davcni_register_in_davcna_stevilka/vpis_v_davcni_register_in_davcna_stevilka_pojasnila/davcna_stevilka_splosno/
		prvih_sedem = Math.floor(1000000 + Math.random() * 8999999).toString().split('');
		kontrolna = 0;
		for(var i=0;i<7;i++){
			kontrolna += prvih_sedem[i]*(8-i);
		}
		kontrolna = 11 - kontrolna % 11;
		if(kontrolna == 10){kontrolna = 0;} //tako je pravilo
		if(kontrolna == 11){return gen_davcna();} //ponovi postopek, ker se ta davčna izloči
		return prvih_sedem.join('') + kontrolna.toString();
	}

	function gen_kraj(){
		return window.naslovi[Math.floor(Math.random()*window.naslovi.length)].replace(/(\d+)+/, function(n){ return Math.floor(1+Math.random()*32) }); //spremeni hišno številko
	}

	function gen_geslo(){
		keymap='abcdefghijklmnopqrstuvwxyz123456789.,-_/=+'
		geslo=''

		for (var i=0;i<10+Math.floor(Math.random()*6);i++){
			geslo+=keymap.charAt(Math.floor(Math.random()*keymap.length))
		}
		return geslo;
	}

	return gen_ime(spol) + ';' + gen_kraj() + ';' + gen_telefonska() + ';' + gen_datum() + ';' + gen_emso() + ';' + gen_davcna();
}