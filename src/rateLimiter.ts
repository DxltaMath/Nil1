/** Server rate limiter */
import RateLimit from "express-rate-limit";


/*-----------------------------------------------*
 *                                               *
 *                 RATE LIMITER                  *
 *                                               *
 ------------------------------------------------*/


/** Change 0 to the amount of miliseconds you want your server to use as a timeframe for the rate limiter. Otherwise, it will default to 10 seconds. 
 * CAUTION: This is in miliseconds. Setting this too low will result in requests being denied for rate limit reasons. */
export const RateLimitTime : number = 0;

 /** Change 0 to the amount of requests that can be completed during a single ratelimit timeframe. Otherwise, it will default to 4. 
 * CAUTION: Setting this too low can impact user experience. */
export const RateLimitRequests : number = 0;
 
/** Rate Limiter for express server.
 * DO NOT TOUCH - НЕ ТРОГАТЬ - 請勿觸摸 - ĐỪNG ĐỤNG VÀO - 手を触れないでください - NE PAS TOUCHER - لا تلمس - NE TUŜU */
export const rLimit = RateLimit({
     windowMs:  RateLimitTime || 10*1000, // 10 seconds
     max: RateLimitRequests || 20, // limit each IP to 20 requests per windowMs
     message: "You are being rate limited as you are sending too many requests.",
}); 
