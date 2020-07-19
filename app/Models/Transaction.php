<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    const TYPE_INCOME = 1;
    const TYPE_TRANSFER  = 2;
    const TYPE_EXPENSE = 3;
}
