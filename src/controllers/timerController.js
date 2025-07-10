import TimerSession from "../models/TimerSession.js";



export const startTimerSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const { selectedDuration } = req.body;

        let timerSession;
        timerSession = await TimerSession.findOne({ userId, status: { $in: ['paused', 'reset'] } });

        if (timerSession) {
            if (timerSession.status === 'paused' && timerSession.pauseStartTime) {
                const pausedDuration = (new Date().getTime() - timerSession.pauseStartTime.getTime()) / 1000;
                timerSession.totalPausedTime += pausedDuration;
                timerSession.pauseStartTime = null;
            }
            timerSession.status = 'running';
            await timerSession.save();
            return res.status(200).json({ message: 'Taymer sessiyası davam etdirildi.', timerSession });
        } else {
            timerSession = new TimerSession({
                userId,
                selectedDuration,
                startTime: new Date(),
                status: 'running',
                elapsedTime: 0,
                totalPausedTime: 0,
                
            });
            await timerSession.save();
            return res.status(201).json({ message: 'Yeni taymer sessiyası yaradıldı və başladı.', timerSession });
        }

    } catch (error) {
        console.error('Taymer sessiyası başlatıla bilmədi:', error);
        res.status(500).json({ message: 'Server xətası, taymer sessiyası başlatıla bilmədi.' });
    }
};

export const pauseTimerSession = async (req, res) => {
    try {
        const { timerId } = req.params;
        const { elapsedTime } = req.body;
        const userId = req.user.id;

        const timerSession = await TimerSession.findOne({ _id: timerId, userId });

        if (!timerSession) {
            return res.status(404).json({ message: 'Bu taymer sessiyası tapılmadı və ya sizə aid deyil.' });
        }

        if (timerSession.status === 'running') {
            timerSession.status = 'paused';
            timerSession.elapsedTime = elapsedTime;
            timerSession.pauseStartTime = new Date();

            await timerSession.save();
            res.status(200).json({ message: 'Taymer sessiyası fasiləyə verildi.', timerSession });
        } else {
            return res.status(400).json({ message: 'Taymer sessiyası artıq fasilədədir, dayandırılıb və ya tamamlanıb.' });
        }
    } catch (error) {
        console.error('Taymer sessiyası fasiləyə verilə bilmədi:', error);
        res.status(500).json({ message: 'Server xətası, taymer sessiyası fasiləyə verilə bilmədi.' });
    }
};

export const completeTimerSession = async (req, res) => {
    try {
        const { timerId } = req.params;
        const { elapsedTime } = req.body;
        const userId = req.user.id;

        const timerSession = await TimerSession.findOne({ _id: timerId, userId });

        if (!timerSession) {
            return res.status(404).json({ message: 'Bu taymer sessiyası tapılmadı və ya sizə aid deyil.' });
        }

        if (timerSession.status === 'paused' && timerSession.pauseStartTime) {
            const pausedDuration = (new Date().getTime() - timerSession.pauseStartTime.getTime()) / 1000;
            timerSession.totalPausedTime += pausedDuration;
            timerSession.pauseStartTime = null;
        }

        timerSession.status = 'completed';
        timerSession.endTime = new Date();
        timerSession.elapsedTime = elapsedTime;

        await timerSession.save();
        res.status(200).json({ message: 'Taymer sessiyası tamamlandı.', timerSession });

    } catch (error) {
        console.error('Taymer sessiyası tamamlana bilmədi:', error);
        res.status(500).json({ message: 'Server xətası, taymer sessiyası tamamlana bilmədi.' });
    }
};

export const stopTimerSession = async (req, res) => {
    try {
        const { timerId } = req.params;
        const { elapsedTime } = req.body; 
        const userId = req.user.id;

        const timerSession = await TimerSession.findOne({ _id: timerId, userId });

        if (!timerSession) {
            return res.status(404).json({ message: 'Bu taymer sessiyası tapılmadı və ya sizə aid deyil.' });
        }

        if (timerSession.status === 'paused' && timerSession.pauseStartTime) {
            const pausedDuration = (new Date().getTime() - timerSession.pauseStartTime.getTime()) / 1000;
            timerSession.totalPausedTime += pausedDuration;
            timerSession.pauseStartTime = null;
        }

        timerSession.status = 'stopped';
        timerSession.endTime = new Date();
        timerSession.elapsedTime = elapsedTime;

        await timerSession.save();
        res.status(200).json({ message: 'Taymer sessiyası tamamilə dayandırıldı.', timerSession });

    } catch (error) {
        console.error('Taymer sessiyası dayandırıla bilmədi:', error);
        res.status(500).json({ message: 'Server xətası, taymer sessiyası dayandırıla bilmədi.' });
    }
};

export const getUserTimerSessions = async (req, res) => {
    try {
        const userId = req.user.id;
        const timerSessions = await TimerSession.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json(timerSessions);
    } catch (error) {
        console.error('İstifadəçi taymer sessiyaları alına bilmədi:', error);
        res.status(500).json({ message: 'Server xətası, taymer sessiyaları alına bilmədi.' });
    }
};

export const deleteTimerSession = async (req, res) => {
    try {
        const { timerId } = req.params;
        const userId = req.user.id;

        const result = await TimerSession.deleteOne({ _id: timerId, userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Taymer sessiyası tapılmadı və ya sizə aid deyil.' });
        }

        res.status(200).json({ message: 'Taymer sessiyası uğurla silindi.' });
    } catch (error) {
        console.error('Taymer sessiyası silinə bilmədi:', error);
        res.status(500).json({ message: 'Server xətası, taymer sessiyası silinə bilmədi.' });
    }
};




// export const createTimerSession = async (req, res) => {
//     try {
//         const { selectedDuration } = req.body;
//         const userId = req.user.id; 
//         const newTimerSession = new TimerSession({
//             userId,
//             selectedDuration,
//         });
//         await newTimerSession.save();

//         res.status(201).json(newTimerSession);
//     } catch (error) {
//         console.error('Taymer sessiyası yaradıla bilmədi:', error);
//         res.status(500).json({ message: 'Server xətası, taymer sessiyası yaradıla bilmədi.' });
//     }
// };