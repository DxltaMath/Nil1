export default class displayImages {

	/** All potential displayed images when Nil loads. */
	public static readonly array : Array<string> = [
		// the XVIDEOS logo lmao
		"https://imgs.search.brave.com/0PF1pc7HCTwZ5oClMEETu0iRHlfdeLE7VKJR_Z_hOYo/rs:fit:768:432:1/g:ce/aHR0cDovL3RvdXMt/bG9nb3MuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDE5LzAx/L2xvZ28tWFZpZCVD/MyVBOW9zLTc2OHg0/MzIuanBn",
	];

	/** Gets you a random image from displayImages */
	public static random () : string {
		// random value of the array, if something doesn't work, then simply use the DxltaMath logo.
		return this.array[Math.floor(Math.random() * this.array.length)] || "https://raw.githubusercontent.com/DxltaMath/assets/master/profile/DxltaMath.jpg";
	}
}