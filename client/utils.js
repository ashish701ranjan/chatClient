Template.registerHelper("stringify", function(o) {
	if (!o) return o;
	return JSON.stringify(o);
})