#!/usr/bin/env python3
"""
AI-Powered Crowd Detection Script for Canteen Connect

This script uses a pre-trained YOLO model to detect people in real-time
from a webcam feed and sends the count to the backend API.

Requirements:
- Webcam access
- Internet connection for API communication
- YOLO model (automatically downloaded on first run)

Usage:
    python crowd_detector.py

Configuration:
    - Update API_ENDPOINT if your backend runs on a different URL
    - Adjust DETECTION_INTERVAL for different update frequencies
    - Modify MAX_CAPACITY based on your canteen's capacity
"""

import cv2
import requests
import time
import json
from datetime import datetime
import logging
from ultralytics import YOLO
import numpy as np 

# Configuration
API_ENDPOINT = "http://localhost:5000/api/crowd/report"
DETECTION_INTERVAL = 15  # seconds between detections
MAX_CAPACITY = 100  # maximum capacity of the canteen
WEBCAM_INDEX = 0  # usually 0 for built-in webcam

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('crowd_detector.log'),
        logging.StreamHandler()
    ]
)

class CrowdDetector:
    def __init__(self):
        """Initialize the crowd detector with YOLO model and webcam."""
        self.logger = logging.getLogger(__name__)
        self.model = None
        self.cap = None
        self.is_running = False
        
        # Initialize YOLO model
        self._load_model()
        
        # Initialize webcam
        self._init_webcam()
    
    def _load_model(self):
        """Load the YOLO model for person detection."""
        try:
            self.logger.info("Loading YOLO model...")
            # Load pre-trained YOLO model (automatically downloads if not present)
            self.model = YOLO('yolov8n.pt')  # Using nano model for speed
            self.logger.info("YOLO model loaded successfully")
        except Exception as e:
            self.logger.error(f"Failed to load YOLO model: {e}")
            raise
    
    def _init_webcam(self):
        """Initialize webcam connection."""
        try:
            self.cap = cv2.VideoCapture(WEBCAM_INDEX)
            if not self.cap.isOpened():
                raise Exception(f"Could not open webcam at index {WEBCAM_INDEX}")
            
            # Set webcam properties for better performance
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            self.cap.set(cv2.CAP_PROP_FPS, 30)
            
            self.logger.info("Webcam initialized successfully")
        except Exception as e:
            self.logger.error(f"Failed to initialize webcam: {e}")
            raise
    
    def detect_people(self, frame):
        """
        Detect people in the given frame using YOLO.
        
        Args:
            frame: OpenCV frame (numpy array)
            
        Returns:
            int: Number of people detected
        """
        try:
            # Run YOLO inference
            results = self.model(frame, verbose=False)
            
            # Count people (class 0 is 'person' in COCO dataset)
            person_count = 0
            for result in results:
                boxes = result.boxes
                if boxes is not None:
                    for box in boxes:
                        # Check if detected object is a person (class 0)
                        if int(box.cls) == 0:
                            # Get confidence score
                            confidence = float(box.conf)
                            # Only count if confidence is above threshold
                            if confidence > 0.5:
                                person_count += 1
            
            return person_count
            
        except Exception as e:
            self.logger.error(f"Error during person detection: {e}")
            return 0
    
    def send_crowd_data(self, person_count):
        """
        Send crowd data to the backend API.
        
        Args:
            person_count: Number of people detected
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            payload = {
                'personCount': int(person_count)
            }
            
            headers = {
                'Content-Type': 'application/json'
            }
            
            response = requests.post(
                API_ENDPOINT,
                json=payload,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 201:
                self.logger.info(f"Successfully sent count: {person_count} people")
                return True
            else:
                self.logger.warning(f"API returned status {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Failed to send data to API: {e}")
            return False
        except Exception as e:
            self.logger.error(f"Unexpected error sending data: {e}")
            return False
    
    def get_crowd_level(self, person_count):
        """
        Determine crowd level based on person count.
        
        Args:
            person_count: Number of people detected
            
        Returns:
            str: Crowd level description
        """
        percentage = (person_count / MAX_CAPACITY) * 100
        
        if percentage >= 80:
            return "Crowded"
        elif percentage >= 50:
            return "Busy"
        elif percentage >= 20:
            return "Moderate"
        else:
            return "Not Busy"
    
    def run_detection_loop(self):
        """Main detection loop that runs continuously."""
        self.logger.info("Starting crowd detection loop...")
        self.logger.info(f"Detection interval: {DETECTION_INTERVAL} seconds")
        self.logger.info(f"API endpoint: {API_ENDPOINT}")
        
        self.is_running = True
        last_detection_time = 0
        
        try:
            while self.is_running:
                current_time = time.time()
                
                # Check if it's time for a new detection
                if current_time - last_detection_time >= DETECTION_INTERVAL:
                    # Capture frame from webcam
                    ret, frame = self.cap.read()
                    if not ret:
                        self.logger.warning("Failed to capture frame from webcam")
                        time.sleep(1)
                        continue
                    
                    # Detect people in the frame
                    person_count = self.detect_people(frame)
                    
                    # Get crowd level
                    crowd_level = self.get_crowd_level(person_count)
                    
                    # Log detection results
                    self.logger.info(f"Detection: {person_count} people - Level: {crowd_level}")
                    
                    # Send data to backend API
                    if self.send_crowd_data(person_count):
                        last_detection_time = current_time
                    else:
                        self.logger.warning("Failed to send data, will retry on next cycle")
                    
                    # Optional: Display frame with detection overlay
                    self._display_frame_with_detections(frame, person_count, crowd_level)
                
                # Small delay to prevent excessive CPU usage
                time.sleep(1)
                
        except KeyboardInterrupt:
            self.logger.info("Detection loop interrupted by user")
        except Exception as e:
            self.logger.error(f"Error in detection loop: {e}")
        finally:
            self.cleanup()
    
    def _display_frame_with_detections(self, frame, person_count, crowd_level):
        """
        Display frame with detection information overlay.
        
        Args:
            frame: OpenCV frame
            person_count: Number of people detected
            crowd_level: Crowd level description
        """
        try:
            # Create a copy of the frame for display
            display_frame = frame.copy()
            
            # Add text overlay
            cv2.putText(
                display_frame,
                f"People: {person_count}",
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0) if person_count < MAX_CAPACITY * 0.7 else (0, 0, 255),
                2
            )
            
            cv2.putText(
                display_frame,
                f"Level: {crowd_level}",
                (10, 70),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (255, 255, 255),
                2
            )
            
            cv2.putText(
                display_frame,
                f"Time: {datetime.now().strftime('%H:%M:%S')}",
                (10, 110),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (255, 255, 255),
                2
            )
            
            # Display the frame
            cv2.imshow('Canteen Crowd Detection', display_frame)
            
            # Wait for key press (1ms) and check for 'q' to quit
            if cv2.waitKey(1) & 0xFF == ord('q'):
                self.is_running = False
                
        except Exception as e:
            self.logger.error(f"Error displaying frame: {e}")
    
    def cleanup(self):
        """Clean up resources."""
        self.logger.info("Cleaning up resources...")
        
        if self.cap:
            self.cap.release()
        
        cv2.destroyAllWindows()
        
        self.logger.info("Cleanup completed")

def main():
    """Main function to run the crowd detector."""
    try:
        # Create and run crowd detector
        detector = CrowdDetector()
        detector.run_detection_loop()
        
    except Exception as e:
        logging.error(f"Failed to start crowd detector: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
