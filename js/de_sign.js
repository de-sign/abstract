const DS = {

	oCfg: {
		TOKEN: '5426534248.91b432b.1d5bc723f16f400593277ac603f6f8c2',
		TAG: '__de_sign'
	},

	bLoad: true,

	oFeed: null,
	aItm: [],
	oElm: {
		hTpl: null,
		hLs: null,
		hLoad: null,
	},

	init: function(){

		this.oElm.hTpl = document.getElementById('tpl-itm--tpl');
		this.oElm.hLs = this.oElm.hTpl.parentNode;
		this.oElm.hLs.removeChild(this.oElm.hTpl);
		this.oElm.hTpl.id = '';

		this.oElm.hLoad = document.getElementsByClassName('tpl-itm--load')[0];

		this.oFeed = new Instafeed({
			accessToken: this.oCfg.TOKEN,
			get: 'tagged',
			tagName: this.oCfg.TAG,
			mock: true,
			success: function(response){
				response.data.forEach(function(data){
					DS.addItm(data);
				});
			}
		});
		this.oFeed.run();
	},

	addItm: function(data){

		if(this.bLoad){
			Array.prototype.forEach.call(
				this.oElm.hLs.querySelectorAll('.tpl-itm--load'),
				function(hElm){
					hElm.parentNode.removeChild(hElm);
				}
			);
			this.bLoad = false;
		}

		let hElm = this.oElm.hTpl.cloneNode(true),
			hImg = hElm.getElementsByClassName('tpl-itm-img')[0],
			sTit = data.caption.text.split('\n')[0].split(' - ')[1],
			sLike = data.likes.count ? data.likes.count + ' like' + ( data.likes.count > 1 ? 's' : '' ) : '&nbsp;';

		hImg.src = data.images.low_resolution.url;
		hImg.width = data.images.low_resolution.width;
		hImg.height = data.images.low_resolution.height;
		
		hElm.getElementsByClassName('tpl-itm-tit')[0].appendChild( document.createTextNode(sTit) );
		hElm.getElementsByClassName('tpl-itm-like')[0].appendChild( document.createTextNode(sLike) );
		data.user_has_liked && hElm.classList.add('tpl-itm--liked');

		hElm.addEventListener('click', function(){
			window.open(data.link, '_blank');
		}, false);

		this.oElm.hLs.appendChild(hElm);

		this.aItm.push({
			hElm: hElm,
			data: data,
			id: data.id
		});
	}
};

DS.init();