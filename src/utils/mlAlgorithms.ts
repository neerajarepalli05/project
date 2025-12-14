export interface MLModel {
  name: string;
  train: (X: number[][], y: number[]) => void;
  predict: (X: number[][]) => number[];
  predictProba?: (X: number[][]) => number[][];
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  specificity: number;
  npv: number; // Negative Predictive Value
  crossValAccuracy: number;
}

// Utility functions
export function trainTestSplit(X: number[][], y: number[], testSize: number = 0.2): {
  XTrain: number[][];
  XTest: number[][];
  yTrain: number[];
  yTest: number[];
} {
  const shuffled = X.map((row, i) => ({ x: row, y: y[i] }));
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const splitIndex = Math.floor(shuffled.length * (1 - testSize));
  const train = shuffled.slice(0, splitIndex);
  const test = shuffled.slice(splitIndex);

  return {
    XTrain: train.map(item => item.x),
    XTest: test.map(item => item.x),
    yTrain: train.map(item => item.y),
    yTest: test.map(item => item.y)
  };
}

export function standardizeFeatures(X: number[][]): { standardized: number[][]; mean: number[]; std: number[] } {
  const numFeatures = X[0].length;
  const mean = new Array(numFeatures).fill(0);
  const std = new Array(numFeatures).fill(0);

  // Calculate mean
  for (let j = 0; j < numFeatures; j++) {
    for (let i = 0; i < X.length; i++) {
      mean[j] += X[i][j];
    }
    mean[j] /= X.length;
  }

  // Calculate standard deviation
  for (let j = 0; j < numFeatures; j++) {
    for (let i = 0; i < X.length; i++) {
      std[j] += Math.pow(X[i][j] - mean[j], 2);
    }
    std[j] = Math.sqrt(std[j] / X.length);
  }

  // Standardize
  const standardized = X.map(row =>
    row.map((val, j) => std[j] === 0 ? 0 : (val - mean[j]) / std[j])
  );

  return { standardized, mean, std };
}

export function createPolynomialFeatures(X: number[][], degree: number = 2): number[][] {
  return X.map(row => {
    const features = [...row];
    
    // Add polynomial features
    for (let i = 0; i < row.length; i++) {
      for (let j = i; j < row.length; j++) {
        if (degree >= 2) {
          features.push(row[i] * row[j]);
        }
      }
    }
    
    // Add squared terms
    for (let i = 0; i < row.length; i++) {
      features.push(row[i] * row[i]);
    }
    
    return features;
  });
}

export function crossValidation(model: MLModel, X: number[][], y: number[], folds: number = 5): number {
  const foldSize = Math.floor(X.length / folds);
  let totalAccuracy = 0;
  
  for (let i = 0; i < folds; i++) {
    const testStart = i * foldSize;
    const testEnd = (i === folds - 1) ? X.length : (i + 1) * foldSize;
    
    const XTest = X.slice(testStart, testEnd);
    const yTest = y.slice(testStart, testEnd);
    const XTrain = [...X.slice(0, testStart), ...X.slice(testEnd)];
    const yTrain = [...y.slice(0, testStart), ...y.slice(testEnd)];
    
    // Create new model instance for each fold
    const foldModel = Object.create(Object.getPrototypeOf(model));
    Object.assign(foldModel, model);
    
    foldModel.train(XTrain, yTrain);
    const predictions = foldModel.predict(XTest);
    const metrics = calculateMetrics(yTest, predictions);
    totalAccuracy += metrics.accuracy;
  }
  
  return totalAccuracy / folds;
}

export function applyStandardization(X: number[][], mean: number[], std: number[]): number[][] {
  return X.map(row =>
    row.map((val, j) => std[j] === 0 ? 0 : (val - mean[j]) / std[j])
  );
}

export function calculateMetrics(yTrue: number[], yPred: number[]): ModelMetrics {
  let tp = 0, fp = 0, tn = 0, fn = 0;

  for (let i = 0; i < yTrue.length; i++) {
    if (yTrue[i] === 1 && yPred[i] === 1) tp++;
    else if (yTrue[i] === 0 && yPred[i] === 1) fp++;
    else if (yTrue[i] === 0 && yPred[i] === 0) tn++;
    else if (yTrue[i] === 1 && yPred[i] === 0) fn++;
  }

  const accuracy = (tp + tn) / (tp + fp + tn + fn);
  const precision = tp / (tp + fp) || 0;
  const recall = tp / (tp + fn) || 0;
  const specificity = tn / (tn + fp) || 0;
  const npv = tn / (tn + fn) || 0;
  const f1Score = 2 * (precision * recall) / (precision + recall) || 0;
  const auc = calculateAUC(yTrue, yPred);

  return { 
    accuracy, 
    precision, 
    recall, 
    f1Score, 
    auc, 
    specificity, 
    npv,
    crossValAccuracy: 0 // Will be set separately
  };
}

function calculateAUC(yTrue: number[], yPred: number[]): number {
  // Simplified AUC calculation
  const positives = yTrue.filter(y => y === 1).length;
  const negatives = yTrue.length - positives;
  
  if (positives === 0 || negatives === 0) return 0.5;
  
  let correctPairs = 0;
  let totalPairs = 0;
  
  for (let i = 0; i < yTrue.length; i++) {
    for (let j = i + 1; j < yTrue.length; j++) {
      if (yTrue[i] !== yTrue[j]) {
        totalPairs++;
        if ((yTrue[i] === 1 && yPred[i] === 1 && yPred[j] === 0) ||
            (yTrue[j] === 1 && yPred[j] === 1 && yPred[i] === 0)) {
          correctPairs++;
        }
      }
    }
  }
  
  return totalPairs > 0 ? correctPairs / totalPairs : 0.5;
}

// Logistic Regression
export class LogisticRegression implements MLModel {
  name = 'Logistic Regression';
  weights: number[] = [];
  bias: number = 0;
  learningRate: number = 0.01;
  iterations: number = 5000;
  regularization: number = 0.1; // L2 regularization
  tolerance: number = 1e-6;

  private sigmoid(z: number): number {
    return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z))));
  }

  train(X: number[][], y: number[]): void {
    const m = X.length;
    const n = X[0].length;
    
    this.weights = new Array(n).fill(0);
    this.bias = 0;
    let prevCost = Infinity;

    for (let iter = 0; iter < this.iterations; iter++) {
      const predictions = X.map(row => {
        const z = row.reduce((sum, xi, i) => sum + xi * this.weights[i], 0) + this.bias;
        return this.sigmoid(z);
      });

      // Calculate cost for convergence check
      let cost = 0;
      for (let i = 0; i < m; i++) {
        const p = Math.max(1e-15, Math.min(1 - 1e-15, predictions[i]));
        cost += -y[i] * Math.log(p) - (1 - y[i]) * Math.log(1 - p);
      }
      cost = cost / m + this.regularization * this.weights.reduce((sum, w) => sum + w * w, 0) / (2 * m);

      // Calculate gradients
      const dw = new Array(n).fill(0);
      let db = 0;

      for (let i = 0; i < m; i++) {
        const error = predictions[i] - y[i];
        for (let j = 0; j < n; j++) {
          dw[j] += error * X[i][j] + this.regularization * this.weights[j];
        }
        db += error;
      }

      // Update weights
      const adaptiveLR = this.learningRate / (1 + iter * 0.0001);
      for (let j = 0; j < n; j++) {
        this.weights[j] -= adaptiveLR * dw[j] / m;
      }
      this.bias -= adaptiveLR * db / m;

      // Early stopping
      if (Math.abs(prevCost - cost) < this.tolerance) {
        break;
      }
      prevCost = cost;
    }
  }

  predict(X: number[][]): number[] {
    return X.map(row => {
      const z = row.reduce((sum, xi, i) => sum + xi * this.weights[i], 0) + this.bias;
      return this.sigmoid(z) >= 0.5 ? 1 : 0;
    });
  }

  predictProba(X: number[][]): number[][] {
    return X.map(row => {
      const z = row.reduce((sum, xi, i) => sum + xi * this.weights[i], 0) + this.bias;
      const prob = this.sigmoid(z);
      return [1 - prob, prob];
    });
  }
}

// Decision Tree (simplified implementation)
export class DecisionTree implements MLModel {
  name = 'Decision Tree';
  tree: any = null;
  maxDepth: number = 8;
  minSamplesSplit: number = 5;
  minSamplesLeaf: number = 2;

  private giniImpurity(y: number[]): number {
    const counts = y.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const total = y.length;
    let gini = 1;
    for (const count of Object.values(counts)) {
      gini -= Math.pow(count / total, 2);
    }
    return gini;
  }

  private findBestSplit(X: number[][], y: number[]): { feature: number; threshold: number; gain: number } {
    let bestGain = 0;
    let bestFeature = 0;
    let bestThreshold = 0;

    const currentGini = this.giniImpurity(y);

    for (let feature = 0; feature < X[0].length; feature++) {
      const values = X.map(row => row[feature]);
      const uniqueValues = [...new Set(values)].sort((a, b) => a - b);

      for (let i = 0; i < uniqueValues.length - 1; i++) {
        const threshold = (uniqueValues[i] + uniqueValues[i + 1]) / 2;
        
        const leftIndices: number[] = [];
        const rightIndices: number[] = [];

        for (let j = 0; j < X.length; j++) {
          if (X[j][feature] <= threshold) {
            leftIndices.push(j);
          } else {
            rightIndices.push(j);
          }
        }

        if (leftIndices.length === 0 || rightIndices.length === 0) continue;

        const leftY = leftIndices.map(idx => y[idx]);
        const rightY = rightIndices.map(idx => y[idx]);

        const leftGini = this.giniImpurity(leftY);
        const rightGini = this.giniImpurity(rightY);

        const weightedGini = (leftY.length / y.length) * leftGini + (rightY.length / y.length) * rightGini;
        const gain = currentGini - weightedGini;

        if (gain > bestGain) {
          bestGain = gain;
          bestFeature = feature;
          bestThreshold = threshold;
        }
      }
    }

    return { feature: bestFeature, threshold: bestThreshold, gain: bestGain };
  }

  private buildTree(X: number[][], y: number[], depth: number = 0): any {
    const uniqueClasses = [...new Set(y)];
    
    if (uniqueClasses.length === 1 || 
        depth >= this.maxDepth || 
        X.length < this.minSamplesSplit ||
        X.length < this.minSamplesLeaf * 2) {
      const counts = y.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      return { prediction: Object.keys(counts).reduce((a, b) => counts[parseInt(a)] > counts[parseInt(b)] ? a : b) };
    }

    const { feature, threshold, gain } = this.findBestSplit(X, y);

    if (gain === 0) {
      const counts = y.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      return { prediction: Object.keys(counts).reduce((a, b) => counts[parseInt(a)] > counts[parseInt(b)] ? a : b) };
    }

    const leftIndices: number[] = [];
    const rightIndices: number[] = [];

    for (let i = 0; i < X.length; i++) {
      if (X[i][feature] <= threshold) {
        leftIndices.push(i);
      } else {
        rightIndices.push(i);
      }
    }

    const leftX = leftIndices.map(idx => X[idx]);
    const leftY = leftIndices.map(idx => y[idx]);
    const rightX = rightIndices.map(idx => X[idx]);
    const rightY = rightIndices.map(idx => y[idx]);

    return {
      feature,
      threshold,
      left: this.buildTree(leftX, leftY, depth + 1),
      right: this.buildTree(rightX, rightY, depth + 1)
    };
  }

  train(X: number[][], y: number[]): void {
    this.tree = this.buildTree(X, y);
  }

  private predictSingle(x: number[]): number {
    let node = this.tree;
    
    while (node.feature !== undefined) {
      if (x[node.feature] <= node.threshold) {
        node = node.left;
      } else {
        node = node.right;
      }
    }
    
    return parseInt(node.prediction);
  }

  predict(X: number[][]): number[] {
    return X.map(row => this.predictSingle(row));
  }
}

// K-Nearest Neighbors
export class KNearestNeighbors implements MLModel {
  name = 'K-Nearest Neighbors';
  XTrain: number[][] = [];
  yTrain: number[] = [];
  k: number = 7; // Increased for better performance

  private euclideanDistance(a: number[], b: number[]): number {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
  }

  train(X: number[][], y: number[]): void {
    this.XTrain = X;
    this.yTrain = y;
  }

  predict(X: number[][]): number[] {
    return X.map(x => {
      const distances = this.XTrain.map((trainX, i) => ({
        distance: this.euclideanDistance(x, trainX),
        label: this.yTrain[i]
      }));

      distances.sort((a, b) => a.distance - b.distance);
      const kNearest = distances.slice(0, this.k);

      const votes = kNearest.reduce((acc, { label }) => {
        acc[label] = (acc[label] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      return parseInt(Object.keys(votes).reduce((a, b) => votes[parseInt(a)] > votes[parseInt(b)] ? a : b));
    });
  }
}

// Random Forest (simplified implementation)
export class RandomForest implements MLModel {
  name = 'Random Forest';
  trees: DecisionTree[] = [];
  nTrees: number = 100; // Increased number of trees
  maxFeatures: number = 0;
  featureIndices: number[][] = [];

  train(X: number[][], y: number[]): void {
    this.trees = [];
    this.featureIndices = [];
    this.maxFeatures = Math.floor(Math.sqrt(X[0].length));
    
    for (let i = 0; i < this.nTrees; i++) {
      const tree = new DecisionTree();
      tree.maxDepth = 15; // Deeper trees for ensemble
      tree.minSamplesSplit = 2;
      tree.minSamplesLeaf = 1;
      
      // Bootstrap sampling
      const bootstrapIndices = Array.from({ length: X.length }, () => 
        Math.floor(Math.random() * X.length)
      );
      
      // Feature bagging - randomly select features
      const selectedFeatures = this.selectRandomFeatures(X[0].length);
      this.featureIndices.push(selectedFeatures);
      const bootstrapX = bootstrapIndices.map(idx => 
        selectedFeatures.map(featureIdx => X[idx][featureIdx])
      );
      const bootstrapY = bootstrapIndices.map(idx => y[idx]);
      
      tree.train(bootstrapX, bootstrapY);
      this.trees.push(tree);
    }
  }
  
  private selectRandomFeatures(totalFeatures: number): number[] {
    const features: number[] = [];
    const selected = new Set<number>();
    
    while (features.length < this.maxFeatures) {
      const feature = Math.floor(Math.random() * totalFeatures);
      if (!selected.has(feature)) {
        selected.add(feature);
        features.push(feature);
      }
    }
    
    return features.sort((a, b) => a - b);
  }

  predict(X: number[][]): number[] {
    const predictions = this.trees.map((tree, treeIdx) => {
      const selectedFeatures = this.featureIndices[treeIdx];
      const transformedX = X.map(row => 
        selectedFeatures.map(featureIdx => row[featureIdx])
      );
      return tree.predict(transformedX);
    });
    
    return X.map((_, i) => {
      const votes = predictions.map(pred => pred[i]);
      const counts = votes.reduce((acc, vote) => {
        acc[vote] = (acc[vote] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      
      return parseInt(Object.keys(counts).reduce((a, b) => counts[parseInt(a)] > counts[parseInt(b)] ? a : b));
    });
  }

  predictProba(X: number[][]): number[][] {
    const predictions = this.trees.map((tree, treeIdx) => {
      const selectedFeatures = this.featureIndices[treeIdx];
      const transformedX = X.map(row => 
        selectedFeatures.map(featureIdx => row[featureIdx])
      );
      return tree.predict(transformedX);
    });
    
    return X.map((_, i) => {
      const votes = predictions.map(pred => pred[i]);
      const positiveVotes = votes.filter(v => v === 1).length;
      const probability = positiveVotes / votes.length;
      return [1 - probability, probability];
    });
  }
}

// Support Vector Machine (simplified linear SVM)
export class SupportVectorMachine implements MLModel {
  name = 'Support Vector Machine';
  weights: number[] = [];
  bias: number = 0;
  learningRate: number = 0.0001;
  iterations: number = 3000;
  C: number = 10.0; // Increased regularization parameter

  train(X: number[][], y: number[]): void {
    const m = X.length;
    const n = X[0].length;
    
    this.weights = new Array(n).fill(0);
    this.bias = 0;

    // Convert labels from {0, 1} to {-1, 1}
    const yConverted = y.map(label => label === 0 ? -1 : 1);

    for (let iter = 0; iter < this.iterations; iter++) {
      for (let i = 0; i < m; i++) {
        const xi = X[i];
        const yi = yConverted[i];
        
        const decision = xi.reduce((sum, x, j) => sum + x * this.weights[j], 0) + this.bias;
        
        if (yi * decision < 1) {
          // Misclassified or within margin
          for (let j = 0; j < n; j++) {
            this.weights[j] = this.weights[j] - this.learningRate * (this.weights[j] - this.C * yi * xi[j]);
          }
          this.bias = this.bias - this.learningRate * (-this.C * yi);
        } else {
          // Correctly classified and outside margin
          for (let j = 0; j < n; j++) {
            this.weights[j] = this.weights[j] - this.learningRate * this.weights[j];
          }
        }
      }
    }
  }

  predict(X: number[][]): number[] {
    return X.map(row => {
      const decision = row.reduce((sum, xi, i) => sum + xi * this.weights[i], 0) + this.bias;
      return decision >= 0 ? 1 : 0;
    });
  }
}

// Ensemble Model combining multiple algorithms
export class EnsembleModel implements MLModel {
  name = 'Ensemble Model';
  models: MLModel[] = [];
  weights: number[] = [];
  
  constructor() {
    this.models = [
      new LogisticRegression(),
      new RandomForest(),
      new SupportVectorMachine()
    ];
  }
  
  train(X: number[][], y: number[]): void {
    // Train each model
    const { standardized: XStd, mean, std } = standardizeFeatures(X);
    
    // Train models with appropriate preprocessing
    this.models[0].train(XStd, y); // Logistic Regression (standardized)
    this.models[1].train(X, y);    // Random Forest (raw)
    this.models[2].train(XStd, y); // SVM (standardized)
    
    // Calculate weights based on cross-validation performance
    this.weights = this.models.map(model => {
      const cvAccuracy = crossValidation(model, 
        model.name.includes('Forest') ? X : XStd, y, 3);
      return cvAccuracy;
    });
    
    // Normalize weights
    const totalWeight = this.weights.reduce((sum, w) => sum + w, 0);
    this.weights = this.weights.map(w => w / totalWeight);
  }
  
  predict(X: number[][]): number[] {
    const { standardized: XStd } = standardizeFeatures(X);
    
    const predictions = [
      this.models[0].predict(XStd), // Logistic Regression
      this.models[1].predict(X),    // Random Forest
      this.models[2].predict(XStd)  // SVM
    ];
    
    return X.map((_, i) => {
      const weightedSum = predictions.reduce((sum, pred, modelIdx) => 
        sum + pred[i] * this.weights[modelIdx], 0);
      return weightedSum >= 0.5 ? 1 : 0;
    });
  }
  
  predictProba(X: number[][]): number[][] {
    const { standardized: XStd } = standardizeFeatures(X);
    
    const probabilities = [
      this.models[0].predictProba ? this.models[0].predictProba(XStd) : 
        this.models[0].predict(XStd).map(p => [1-p, p]),
      this.models[1].predict(X).map(p => [1-p, p]),
      this.models[2].predict(XStd).map(p => [1-p, p])
    ];
    
    return X.map((_, i) => {
      const weightedProb = probabilities.reduce((sum, prob, modelIdx) => 
        sum + prob[i][1] * this.weights[modelIdx], 0);
      return [1 - weightedProb, weightedProb];
    });
  }
}