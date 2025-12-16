# Multi-Modal Sensor Fusion for Autonomous Driving

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8%2B-blue)
![Status](https://img.shields.io/badge/status-active-success)

## Project Overview
This project implements a robust **Sensor Fusion framework** designed for Autonomous Driving perception systems. It focuses on the mathematical alignment of **3D LIDAR Point Clouds** with **2D Camera Imagery** to create a unified perception output.

Unlike standard "black-box" implementations, this repository demonstrates the underlying **Linear Algebra** and **State Estimation** algorithms (Kalman Filtering) required to project 3D world coordinates onto a 2D image plane with high precision.

<p align="center">
  <img src="https://via.placeholder.com/800x400.png?text=Running+Simulation+Screenshot" alt="Sensor Fusion Visualization">
  <br>
  <em>Figure 1: Visualization of 3D LIDAR point cloud projected onto the camera plane with depth-based color coding.</em>
</p>

## Core Engineering Concepts

### 1. Coordinate Transformations (The Math)
The core challenge in sensor fusion is calibrating the Extrinsic parameters (Rotation $R$ and Translation $T$) between the LIDAR and the Camera. This project implements the homogeneous coordinate transformation:


Where:
* **$P_{world}$**: 3D coordinates from LIDAR $(x, y, z)$.
* **$[R|T]$**: Extrinsic Matrix (LIDAR to Camera transformation).
* **$K$**: Intrinsic Camera Matrix (Focal length, optical center).
* **$P_{img}$**: Final 2D pixel coordinates $(u, v)$.

### 2. Kalman Filtering for Object Tracking
To handle sensor noise and missing data frames, a **Linear Kalman Filter** is implemented to estimate the state vector $[x, y, v_x, v_y]$ of detected objects, ensuring smooth tracking trajectories in real-time.

### 3. Synthetic Data Simulation
Instead of relying on pre-processed datasets (like KITTI) which often mask algorithmic flaws, this project includes a **synthetic data generator**. This module creates dummy 3D obstacles and simulated sensor feeds, allowing for:
* Pure algorithmic validation without dataset bias.
* Real-time adjustment of sensor calibration parameters.
* Verification of edge cases in sensor geometry.

## Tech Stack

* **Core Logic:** Python 3.9+
* **Numerical Computation:** NumPy (Matrix operations & Linear Algebra)
* **Visualization:** Matplotlib (2D/3D plotting)
* **Computer Vision Logic:** Custom implementation (No heavy dependence on high-level APIs)
