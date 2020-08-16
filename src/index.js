/* Copyright © 2020, Imesh Chamara. All rights reserved. */
import {IAR, xhr, icApp} from 'ic-app'
import './style.scss'
const server = API_SERVER
function gtag(){window.dataLayer.push(arguments);}
class site extends IAR {
	constructor() {
		super()
		this.data = {
			ui: 0
		}
		this.links = []
		this.shorten = async a => {
			if(this.load) return
			this.load = 1
			this.update()
			a = new icApp('input[name="link"]')
			this.links.push([a.val, await xhr(server + '/create', 0, JSON.stringify({url: a.val}))])
			a.val = ''
			this.load = 0
			this.update()
			a.v.focus()
			gtag('event', 'create', 'link')
		}
		this.copy = a => {
			a = new icApp(a.target)
			var span
			Array.from(a.p.ch).some(a => new icApp(a).tag.match(/span/i) ? [span = a] : 0)

			var b = window.getSelection(), c = document.createRange()
			b.removeAllRanges()
			c.selectNodeContents(span)
			b.addRange(c)
			document.execCommand('copy')
			b.removeAllRanges()
			a.txt = 'Copied'
			setTimeout(b => a.txt = 'Copy', 400)
			gtag('event', 'copy', 'link')
		}
	}
	didMount() {
		this.update({ui: 1})
		new icApp('input[name="link"]').v.focus()
	}
	render() {
		return ([
			{s: {display: this.data.ui == 0 ? 'flex' : 'none'}},
			{s: {display: this.data.ui != 0 ? 'block' : 'none'}, t:'div', cl: 'main', ch: [
				{t: 'div', cl: 'content', ch: [
					{t: 'span', cl: 'title', ch: ['I', 'URL'].map((a,b) => ({t: 'span', cl: 'c' + b, txt: a}))},
					{t: 'div', cl: 'cont', ch: [
						{t: 'input', at: {type: 'text', placeholder: 'Link', name: 'link'}},
						{t: 'button', cl: 'cr', txt: 'Shorten', e: {onclick: this.shorten}}
					]},
					{t: 'div', cl: 'links', ch: this.links.reverse().map(a => (a[1] && a[1].success && a[1].result && ({t: 'div', cl: 'link', ch: [
						{t: 'span', txt: a[1].result.web},
						{t: 'button', txt: 'Copy', e: {onclick: this.copy}},
						{t: 'a', at: {target: '_blank', href: a[1].result.web}, txt: 'Open'}
					]})) || ({t: 'div', cl: 'err', ch: [
						{t: 'span', txt: (a[1] && a[1].error && a[1].error.message) || 'Error'}
					]}))}
				]},
				{t: 'div', cl: 'fo', ch: [
					{t: 'span', nodes: 1, ch: ['IUrl © 2020, All Rights Reserved. Developed by ', {t: 'a', at: {target: '_blank', href: 'https://ic-tech.now.sh/contact.html?product=IUrl'}, txt: 'IC-Tech'}]}
				]}
			]}
		])
	}
}
new site().mount('#root')
