import React, { useState } from 'react';
import { Container, Typography, TextField, Button , Paper, Box, Alert, AppBar, Toolbar} from '@mui/material';
import { parse } from 'mathjs';
import { useNavigate } from 'react-router-dom';

const Userdefined: React.FC = () => {
  const navigate = useNavigate();

  const handlePF = () => {
    navigate('/predefined');
  };

  const handleUF = () => {
      navigate('/');
    };

  const [values, setValues] = useState({
    a: '-1',
    b: '1',
    n: '100',
    expression: 'sinh(x)',
  });
  const [resultTrapezoid, setResultTrapezoid] = useState<string | undefined>('');
  const [resultSimpson, setResultSimpson] = useState<string | undefined>('');
  const [alertVisible, setAlertVisible] = useState(false); // New state variable
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculate();
    setAlertVisible(true);
  };

  const calculate = () => {
    const { a, b, n, expression } = values;
 
    if (!a || !b || !n || !expression) {
      setResultTrapezoid('Please fill in all the required fields.');
      setResultSimpson('Please fill in all the required fields.');
      return;
    }
 
    const parsedA = parseFloat(a);
    const parsedB = parseFloat(b);
    const parsedN = parseInt(n);
 
    if (isNaN(parsedA) || isNaN(parsedB) || isNaN(parsedN)) {
      setResultTrapezoid('Invalid input. Please enter numerical values.');
      setResultSimpson('Invalid input. Please enter numerical values.');
      return;
    }
 
    const delta = (parsedB - parsedA) / parsedN;
    const slashIndex = expression.indexOf('/');
    const fExpression = expression.substring(0, slashIndex).trim();
    const gExpression = expression.substring(slashIndex + 1).trim();
    const fFn = parse(fExpression).compile();
    const gFn = gExpression ? parse(gExpression).compile() : null;
 
    if (gFn) {
      const divergentPoint = findDivergentPoint(parsedA, parsedB, gFn);
 
      if (divergentPoint !== null) {
        setResultTrapezoid(`Math error. Function is not integrable. Root of the denominator exists at ${divergentPoint}.`);
        setResultSimpson(`Math error. Function is not integrable. Root of the denominator exists at ${divergentPoint}.`);
        return;
      }
    }
 
    let sumTrapezoid = 0;
    let sumSimpson = 0;
 
    for (let i = 1; i < parsedN; i++) {
      const xi = parsedA + i * delta;
 
      try {
        const fi = fFn.evaluate({ x: xi });
        const gi = gFn ? gFn.evaluate({ x: xi }) : 1;
 
        if (!Number.isFinite(fi) || Number.isNaN(fi) || !Number.isFinite(gi) || Number.isNaN(gi) || gi === 0 || gi === Infinity) {
          setResultTrapezoid('Math error. Integral is divergent.');
          setResultSimpson('Math error. Integral is divergent.');
          return;
        }
 
        sumTrapezoid += fi / gi;
 
        if (i % 2 === 0) {
          sumSimpson += 2 * (fi / gi);
        } else {
          sumSimpson += 4 * (fi / gi);
        }
      } catch (error) {
        setResultTrapezoid('Error: Invalid mathematical expression');
        setResultSimpson('Error: Invalid mathematical expression');
        return;
      }
    }
 
    const trapezoidResult = (delta / 2) * (fFn.evaluate({ x: parsedA }) / (gFn ? gFn.evaluate({ x: parsedA }) : 1) + fFn.evaluate({ x: parsedB }) / (gFn ? gFn.evaluate({ x: parsedB }) : 1)) + (delta * sumTrapezoid);
    setResultTrapezoid(trapezoidResult.toFixed(15));
 
    const simpsonResult = (delta / 3) * (fFn.evaluate({ x: parsedA }) / (gFn ? gFn.evaluate({ x: parsedA }) : 1) + fFn.evaluate({ x: parsedB }) / (gFn ? gFn.evaluate({ x: parsedB }) : 1) + sumSimpson);
    setResultSimpson(simpsonResult.toFixed(15));
     // Show the alert dialog
     setAlertVisible(true);
  };
 
  const findDivergentPoint = (a: number, b: number, gFn: any): number | null => {
    const epsilon = 1e-15;
    let left = a;
    let right = b;
 
    while (right - left > epsilon) {
      const mid = (left + right) / 2;
      const gMid = gFn.evaluate({ x: mid });
 
      if (Math.abs(gMid) < epsilon) {
        return mid;
      }
 
      if (gMid > 0) {
        right = mid;
      } else {
        left = mid;
      }
    }
 
    return null;
  };
 
  return (
    <>
            <AppBar position="static">
  <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
    <Button variant="outlined" sx={{ color: 'white', borderColor: 'white' }}  onClick={handleUF}>Userdefined</Button>
    <Button variant="outlined" sx={{ color: 'white', borderColor: 'white', marginLeft: '10px' }} onClick={handlePF}>Predefined</Button>
  </Toolbar>
</AppBar>
    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4rem'}}> 
    <Paper elevation={3} sx={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', paddingTop: '2rem', paddingBottom: '2rem', width:'40rem', height: '100%'}}>
    <Container maxWidth="sm">
 
      <Typography variant="h4" align="center" gutterBottom>
        UserDefined
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Lower Bound (a)"
          variant="filled"
          fullWidth
          margin="normal"
          name="a"
          value={values.a}
          onChange={handleChange}
        />
        <TextField
          label="Upper Bound (b)"
          variant="filled"
          fullWidth
          margin="normal"
          name="b"
          value={values.b}
          onChange={handleChange}
        />
        <TextField
          label="Subintervals (n)"
          variant="filled"
          fullWidth
          margin="normal"
          name="n"
          value={values.n}
          onChange={handleChange}
        />
        <TextField
          label="Expression"
          variant="filled"
          fullWidth
          margin="normal"
          name="expression"
          value={values.expression}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary" sx={{marginBottom: '2rem',marginTop: '2rem',marginLeft: '40%', marginRight: '35%'}}>
          Submit
        </Button>

      </form>
      <Alert severity="info" sx={{display: alertVisible ? 'flex' : 'none'}}>
      <Typography variant="h6" align="center"  gutterBottom>
        Trapezoid Result: {resultTrapezoid !== undefined ? resultTrapezoid : 'undefined'}
      </Typography></Alert>
      {resultSimpson !== undefined && (
        
        <Alert severity="info" sx={{display: alertVisible ? 'flex' : 'none',marginTop:'1.5rem'}}><Typography variant="h6" align="center" gutterBottom >
          Simpson's Result: {resultSimpson}
        </Typography></Alert>
      )}
 
    </Container>
    </Paper>
    </Box>
    </>
  );
};
 
export default Userdefined;
 