<?php


//


$elements = file_get_contents('./03_dic.txt');

$element_array = explode("\n", $elements);

$most = '';
$least = '';

// oxygen
while (true) {
    for ($i = 0; $i < strlen($element_array[0]); $i++) {

        $bits = '';
        for ($j = 0; $j < count($element_array); $j++) {
            $bits[$j] = $element_array[$j][$i];
        }

        // find most and least bit for each index
        $most = most_common_bit($bits); // oxygen
        //$least = least_common_bit($bits); // C02

        $c = count($element_array);
        for ($k = 0; $k < $c; $k++) {
            $v = $element_array[$k];
            if ($v[$i] != $most) {
                // remove
                unset($element_array[$k]);
            }
        }

        $element_array = array_values($element_array);

        if (count($element_array) == 1)
        {
            break;
        }

        if (count($element_array) < 1) {
            die('error');
        }

    }

    if (count($element_array) == 1)
    {
        break;
    }

    if (count($element_array) < 1) {
        die('error');
    }
}

$oxygen = $element_array;
$element_array = explode("\n", $elements);

while (true) {
    for ($i = 0; $i < strlen($element_array[0]); $i++) {

        $bits = '';
        for ($j = 0; $j < count($element_array); $j++) {
            $bits[$j] = $element_array[$j][$i];
        }

        // find most and least bit for each index
        $most = least_common_bit($bits); // C02
        //$least = least_common_bit($bits); // C02

        $c = count($element_array);
        for ($k = 0; $k < $c; $k++) {
            $v = $element_array[$k];
            if ($v[$i] != $most) {
                // remove
                unset($element_array[$k]);
            }
        }

        $element_array = array_values($element_array);

        if (count($element_array) == 1)
        {
            break;
        }

        if (count($element_array) < 1) {
            die('error');
        }

    }

    if (count($element_array) == 1)
    {
        break;
    }

    if (count($element_array) < 1) {
        die('error');
    }
}

$co2 = $element_array;

var_dump($oxygen);
var_dump($co2);



var_dump(bindec($oxygen[0]) * bindec($co2[0]));


// array of bits
function most_common_bit($arr)
{

    $zero = 0;
    $tot = 0;

    for ($i = 0; $i < strlen($arr); $i++) {
        if ($arr[$i] == '0') $zero++;
        $tot++;
    }

    $half = floor($tot / 2);
    if ($zero > $half)
        return '0';
    else
        return '1';

}

function least_common_bit($arr)
{

    $zero = 0;
    $tot = 0;

    for ($i = 0; $i < strlen($arr); $i++) {
        if ($arr[$i] == '0') $zero++;
        $tot++;
    }

    $half = floor($tot / 2);
    if ($zero > $half)
        return '1';
    else
        return '0';

}





