// Created by szatpig at 2019/6/18.
import SvgComponent from './SvgComponent'

// requires and returns all modules that match
const requireAll = requireContext => requireContext.keys().map(requireContext);

// import all svg
const req = require.context('./../../images/svg', true, /\.svg$/);
requireAll(req);

export default SvgComponent