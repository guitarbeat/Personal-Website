export const emotionWheel = {
  "Angry": {
    color: "#FF4D4D",
    icon: "\uD83D\uDD25",
    description: "Feeling upset or annoyed because of something unfair or wrong",
    subEmotions: ["Frustrated", "Annoyed", "Offended", "Irritated", "Betrayed"]
  },
  "Sad": {
    color: "#4D79FF",
    icon: "\uD83D\uDE22",
    description: "Feeling unhappy or sorrowful about something",
    subEmotions: ["Hurt", "Disappointed", "Lonely", "Guilty", "Depressed"]
  },
  "Scared": {
    color: "#9B4DFF",
    icon: "\uD83D\uDE28",
    description: "Feeling afraid or worried about something",
    subEmotions: ["Anxious", "Stressed", "Overwhelmed", "Worried", "Shocked"]
  },
  "Happy": {
    color: "#FFD700",
    icon: "\uD83D\uDE0A",
    description: "Feeling joy, pleasure, or contentment",
    subEmotions: ["Excited", "Grateful", "Optimistic", "Content", "Proud"]
  },
  "Disgusted": {
    color: "#4DFF4D",
    icon: "\uD83E\uDD22",
    description: "Feeling strong disapproval or aversion",
    subEmotions: ["Disapproving", "Disappointed", "Awful", "Repelled"]
  },
  "Surprised": {
    color: "#FF4DFF",
    icon: "\uD83D\uDE32",
    description: "Feeling astonished or taken aback by something unexpected",
    subEmotions: ["Confused", "Amazed", "Stunned", "Startled"]
  }
};

export const circumplex = {
  quadrants: [
    {
      id: "high_valence_high_arousal",
      name: "Excited",
      position: "top-right",
      color: "255, 215, 0",
      emotions: ["Excited", "Elated", "Happy", "Delighted"]
    },
    {
      id: "low_valence_high_arousal",
      name: "Distressed",
      position: "top-left",
      color: "255, 77, 77",
      emotions: ["Angry", "Afraid", "Frustrated", "Anxious"]
    },
    {
      id: "low_valence_low_arousal",
      name: "Depressed",
      position: "bottom-left",
      color: "77, 121, 255",
      emotions: ["Sad", "Bored", "Tired", "Depressed"]
    },
    {
      id: "high_valence_low_arousal",
      name: "Relaxed",
      position: "bottom-right",
      color: "77, 255, 77",
      emotions: ["Calm", "Relaxed", "Serene", "Content"]
    }
  ]
};
