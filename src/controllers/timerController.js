import TimerSession from "../models/TimerSession.js";


export const createTimerSession = async (req, res) => {
    try {
        const { selectedDuration } = req.body;
 
        const userId = req.user.id; 
        const newTimerSession = new TimerSession({
            userId,
            selectedDuration,
          
        });
        await newTimerSession.save();

        res.status(201).json(newTimerSession);
    } catch (error) {
        console.error('Taymer sessiyası yaradıla bilmədi:', error);
        res.status(500).json({ message: 'Server xətası, taymer sessiyası yaradıla bilmədi.' });
    }
};

